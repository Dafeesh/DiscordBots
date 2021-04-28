
export function rollDice(min_random: number, max_random: number): number {
    // Determine odds
    const total_odds = (max_random - min_random) + 1;
    if (total_odds <= 1) {
        throw "Error: Number should be positive and the first number should be smaller than the second.";
    }

    // Determine answer
    return min_random + Math.floor(total_odds * Math.random());
};
