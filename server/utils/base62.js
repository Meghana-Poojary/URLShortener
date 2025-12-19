const Base62 = 'kP0A8eYxS4vL2CzTnR5qUOQm3H9h6Mu1DgBfEJ7oWwZVyplIbGNjrFiKcXsdta';

export function base62Encode(num) {
    num = (num ^ 987654) >>> 0; 
    
    if (num === 0) return "0";

    let result = "";
    while (num > 0) {
        result = Base62[num % 62] + result;
        num = Math.floor(num / 62);
    }

    return result;
}
