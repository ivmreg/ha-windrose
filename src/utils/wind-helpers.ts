export function calculateBeaufort(mph: number): { force: number; description: string } {
    if (mph < 1) return { force: 0, description: 'Calm' };
    if (mph < 4) return { force: 1, description: 'Light Air' };
    if (mph < 8) return { force: 2, description: 'Light Breeze' };
    if (mph < 13) return { force: 3, description: 'Gentle Breeze' };
    if (mph < 19) return { force: 4, description: 'Moderate Breeze' };
    if (mph < 25) return { force: 5, description: 'Fresh Breeze' };
    if (mph < 32) return { force: 6, description: 'Strong Breeze' };
    if (mph < 39) return { force: 7, description: 'Near Gale' };
    if (mph < 47) return { force: 8, description: 'Gale' };
    if (mph < 55) return { force: 9, description: 'Strong Gale' };
    if (mph < 64) return { force: 10, description: 'Storm' };
    if (mph < 73) return { force: 11, description: 'Violent Storm' };
    return { force: 12, description: 'Hurricane' };
}

export function mphToKmh(mph: number): number {
    return mph * 1.60934;
}

export function mphToMps(mph: number): number {
    return mph * 0.44704;
}

export function mpsToKmh(mps: number): number {
    return mps * 3.6;
}
