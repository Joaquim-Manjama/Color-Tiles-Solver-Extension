const solve = (grid, maxMoves) => {
    const empty = [];

    if (gameWon(grid)) return empty;

    const queue = [];
    let head = 0; 
    const visited = new Set();

    const startGrid = copy(grid);
    const startMoves = [];
    queue.push({ grid: startGrid, moves: startMoves });
    visited.add(hash(startGrid));

    const directions = ["LEFT", "UP", "RIGHT", "DOWN"];

    while (head < queue.length) {
        const { grid: currentGrid, moves } = queue[head++]; 
        const currentHash = hash(currentGrid);

        if (gameWon(currentGrid)) {
            return moves;
        }

        if (moves.length >= maxMoves) continue;

        for (const dir of directions) {
            const nextGrid = copy(currentGrid);
            if (move(nextGrid, dir)) {
                maxMoves += 1
            }

            const nextHash = hash(nextGrid);

            if (nextHash === currentHash) continue;
            if (visited.has(nextHash)) continue;

            const nextMoves = moves.slice();
            nextMoves.push(dir);

            if (gameWon(nextGrid)) {
                return nextMoves;
            }

            queue.push({ grid: nextGrid, moves: nextMoves });
            visited.add(nextHash);
        }
    }

    return empty;
}
