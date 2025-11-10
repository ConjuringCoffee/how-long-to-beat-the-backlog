import { HowLongToBeatEntry, HowLongToBeatService } from "./howlongtobeat/howlongtobeat";

export interface EvaluationResult {
    backloggeryName: string;
    howLongToBeatName: string;
    similarity: number;
    gameplayMain: number;
    gameplayMainExtra: number;
    gameplayCompletionist: number;
}

export const evaluateResults = async (game: any): Promise<EvaluationResult>  => {
    const hltbService = new HowLongToBeatService();
    
    let searchResults: HowLongToBeatEntry[];

    try {
        searchResults = await hltbService.search(game.title);
    } catch (error) {
        // Handled below
    }

    if (searchResults === undefined || searchResults.length === 0) {
        return {
                backloggeryName: game.title,
                howLongToBeatName: '',
                similarity: 0,
                gameplayMain: 0,
                gameplayMainExtra: 0,
                gameplayCompletionist: 0,
            }
    } 

    return {
        backloggeryName: game.title,
        howLongToBeatName: searchResults[0].name,
        similarity: Math.round(searchResults[0].similarity * 100), // Multiply and round avoid float issues in CSV
        gameplayMain: searchResults[0].gameplayMain,
        gameplayMainExtra: searchResults[0].gameplayMainExtra,
        gameplayCompletionist: searchResults[0].gameplayCompletionist,
    };
};