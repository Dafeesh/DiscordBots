
export function asNumberPairOrNull(maybe_number: string): number[] {
    let number1 = null;
    let number2 = null;
    try {
        const parts = maybe_number.split(",");
        number1 = Math.round(parseFloat(parts[0])) || null;
        number2 = Math.round(parseFloat(parts[1])) || null;
    } catch { }
    if (number1 === null && number2 === null) {
        return null;
    }
    return [number1, number2];
};
