import { HowLongToBeatService } from "./howlongtobeat";
import { readGamesFromInputFile } from "./readInput";

async function main() {
    const games = await readGamesFromInputFile();
    console.log(`Loaded ${games.length} games`);
    
    const unfinishedGames = games.filter(game => 
        game.priority !== 'Shelved' 
        && ( game.status === 'Unplayed' 
            || game.status === 'Unfinished' ) 
    );

    const hltbService = new HowLongToBeatService();
    hltbService.search(unfinishedGames[0].title).then(result => console.log(result));
};

main();