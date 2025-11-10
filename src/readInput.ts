import { promises as fs } from 'fs';
import path from 'path';

export interface Game {
    uniqueGameId: number;
    title: string;
    platform: string;
    subPlatform: string | null;
    status: string;
    priority: string;
    format: string;
    ownership: string;
    childOf: number | null;
}

function parseFile(text: string): string[][] {
    // normalize newlines
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (ch === '"') {
            // handle escaped quotes ""
            if (inQuotes && text[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (ch === ',' && !inQuotes) {
            row.push(field);
            field = '';
            continue;
        }

        if (ch === '\n' && !inQuotes) {
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
            continue;
        }

        field += ch;
    }

    // push any trailing data (in case file doesn't end with newline)
    if (inQuotes === false && (field !== '' || row.length > 0)) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}

export async function readGamesFromInputFile(): Promise<Game[]> {
    const headerLineIndex = 2;

    const filePath = path.resolve(__dirname, '..', 'input', 'input.csv');
    const rawFile = await fs.readFile(filePath, 'utf8');
    const rows = parseFile(rawFile);

    if (rows.length <= headerLineIndex) {
        return [];
    }

    const headers = rows[headerLineIndex].map(h => h.trim().replace(/^"|"$/g, ''));

    const getGameFromRow = (cells: string[]): Game => {
        const get = (name: string) => {
            const idx = headers.indexOf(name);
            return idx >= 0 ? (cells[idx] ?? '').trim() : '';
        };

        const uidRaw = get('Unique Game ID');
        const childOfRaw = get('Child Of');

        return {
            uniqueGameId: uidRaw === '' ? NaN : Number(uidRaw),
            title: get('Title'),
            platform: get('Platform'),
            subPlatform: get('Sub-Platform') || null,
            status: get('Status'),
            priority: get('Priority'),
            format: get('Format'),
            ownership: get('Ownership'),
            childOf: (() => {
                if (childOfRaw === '') { 
                    return null;
                }
                const childId = Number(childOfRaw);
                return childId || null;
            })(),
        };
    };

    const result: Game[] = [];

    for (let i = headerLineIndex + 1; i < rows.length; i++) {
        result.push(getGameFromRow(rows[i]));
    }

    return result;
}