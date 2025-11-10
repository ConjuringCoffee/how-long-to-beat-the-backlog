import { readGamesFromInputFile } from "./readInput";

async function main() {
    const games = await readGamesFromInputFile();
    console.log(`Loaded ${games.length} games`);
    
    const unfinishedGames = games.filter(game => 
        game.priority !== 'Shelved' 
        && ( game.status === 'Unplayed' 
            || game.status === 'Unfinished' ) 
    );

    console.log(`You have ${unfinishedGames.length} unfinished games in your backlog.`);
};

main();