import { readGamesFromInputFile } from "./readInput";

async function main() {
    const games = await readGamesFromInputFile();
    console.log(`Loaded ${games.length} games`);
    console.log(games[0]);
    console.log(games[1]);
    console.log(games[2]);
}

main();