import { evaluateResults, EvaluationResult } from "./evaluate";
import { readGamesFromInputFile, writeResultsToCSV as writeResultsToOutputFile } from "./io";

async function main() {
    const games = await readGamesFromInputFile();
    
    const evaluationResults: EvaluationResult[] = [];

    await Promise.all( games.map(async (game) => {
        const result = await evaluateResults(game);
        evaluationResults.push(result);
    }));

    await writeResultsToOutputFile(evaluationResults);

    console.log('Done');
};

main();