import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { EvaluationResult } from './hltbevaluate';

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
    //const filePath = path.resolve(__dirname, '..', 'input', 'input.csv');
    const rawFile = await fs.readFile('input/input.csv', 'utf8');
    
    const rows = parse(rawFile, {
        from_line: 3,
        columns: true,
        relax_column_count: true,
    }) as Record<string, string>[];

    return rows.map(row => ({
        uniqueGameId: row['Unique Game ID'] === '' ? NaN : Number(row['Unique Game ID']),
        title: row['Title']?.trim() || '',
        platform: row['Platform']?.trim() || '',
        subPlatform: row['Sub-Platform']?.trim() || null,
        status: row['Status']?.trim() || '',
        priority: row['Priority']?.trim() || '',
        format: row['Format']?.trim() || '',
        ownership: row['Ownership']?.trim() || '',
        childOf: row['Child Of'] ? Number(row['Child Of']) || null : null,
    }));
}

export async function writeResultsToCSV(evaluationResults: EvaluationResult[]): Promise<void> {
    const header = 'Backloggery Name,HowLongToBeat Name,Similarity,Gameplay Main,Gameplay Main + Extra,Gameplay Completionist\n';
    const csvContent = evaluationResults.map((result) => 
        `"${result.backloggeryName}","${result.howLongToBeatName}",${result.similarity},${result.gameplayMain},${result.gameplayMainExtra},${result.gameplayCompletionist}`
    ).join('\n');

    await fs.mkdir('output', { recursive: true });
    await fs.writeFile('output/output.csv', header + csvContent);
}