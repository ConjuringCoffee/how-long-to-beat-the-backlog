import { readGamesFromInputFile } from "./readInput";

async function main() {
    const games = await readGamesFromInputFile();
    console.log(`Loaded ${games.length} games`);
    
    const unfinishedGames = games.filter(game => 
        game.priority !== 'Shelved' 
        && ( game.status === 'Unplayed' 
            || game.status === 'Unfinished' ) 
    );
};

main();