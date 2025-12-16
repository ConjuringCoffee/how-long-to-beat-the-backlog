import { HowLongToBeatEntry, HowLongToBeatService } from "./howlongtobeat/howlongtobeat";
import { Game } from "./io";

export interface EvaluationResult {
    backloggeryName: string;
    howLongToBeatName: string;
    backloggeryPlatform: string;
    backloggerySubPlatform: string | null;
    backloggeryStatus: string;
    backloggeryPriority: string;
    backloggeryOwnership: string;
    similarity: number;
    gameplayMain: number;
    gameplayMainExtra: number;
    gameplayCompletionist: number;
}

export const evaluateResults = async (game: Game): Promise<EvaluationResult>  => {
    const hltbService = new HowLongToBeatService();
    
    let searchResults: HowLongToBeatEntry[];

    try {
        searchResults = await hltbService.search(game.title);
    } catch (error) {
        // Handled below
    }

    let evaluationResult: EvaluationResult = {
        backloggeryName: game.title,
        howLongToBeatName: '',
        backloggeryPlatform: game.platform,
        backloggerySubPlatform: game.subPlatform,
        backloggeryStatus: game.status,
        backloggeryPriority: game.priority,
        backloggeryOwnership: game.ownership,
        similarity: 0,
        gameplayMain: 0,
        gameplayMainExtra: 0,
        gameplayCompletionist: 0,
    }

    if (searchResults === undefined || searchResults.length === 0) {
        return evaluationResult;
    } 

    evaluationResult.howLongToBeatName = searchResults[0].name,
    evaluationResult.similarity = Math.round(searchResults[0].similarity * 100); // Multiply and round avoid float issues in CSV
    evaluationResult.gameplayMain = searchResults[0].gameplayMain;
    evaluationResult.gameplayMainExtra = searchResults[0].gameplayMainExtra;
    evaluationResult.gameplayCompletionist = searchResults[0].gameplayCompletionist;
    return evaluationResult;
};