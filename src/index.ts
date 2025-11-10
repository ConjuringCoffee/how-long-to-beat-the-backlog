import { evaluateResults, EvaluationResult } from "./evaluate";
import { readGamesFromInputFile, writeResultsToCSV as writeResultsToOutputFile } from "./io";

async function main() {
    const games = await readGamesFromInputFile();
    
    const unfinishedGames = games.filter(game => 
        game.priority !== 'Shelved' 
        && ( game.status === 'Unplayed' 
            || game.status === 'Unfinished' ) 
    );

    const evaluationResults: EvaluationResult[] = [];

    await Promise.all( unfinishedGames.map(async (game) => {
        const result = await evaluateResults(game);
        evaluationResults.push(result);
    }));

    await writeResultsToOutputFile(evaluationResults);

    console.log('Done');
};

main();