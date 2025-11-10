import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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

export async function readGamesFromInputFile(): Promise<Game[]> {
    const headerLineIndex = 1;

    const filePath = path.resolve(__dirname, '..', 'input', 'input.csv');
    const rawFile = await fs.readFile(filePath, 'utf8');
    const rows = parse(rawFile, {
        skip_empty_lines: true,
        relax_column_count: true,
    }) as string[][];

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