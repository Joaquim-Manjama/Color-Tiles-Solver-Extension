// Convert 1D board into 2D grid
const makeGrid = (grid) => {

    const size = Math.sqrt(grid.length);
    let board = [];

    for (let i = 0; i < size; i++) {
        let row = [];

        for (let j = 0; j < size; j++) {

            row.push(grid[i * size + j]);
        }

        board.push(row);
    }
    return board;
}

// Get the number of tiles of each colour
const getColoursCopy = (grid) => {

    const coloursMap = new Map();
    const size = grid.length;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const colour = grid[i][j];

            // Only count positive colours (ignore EMPTY and BLOCK)
            if (colour > 0) {
                const count = coloursMap.get(colour) || 0;
                coloursMap.set(colour, count + 1);
            }
        }
    }

    // Convert to array of [colour, count] pairs like coloursCopy
    return Array.from(coloursMap.entries());
}

// Check if there is a matched ground of tiles
const checkMatches = (grid) => {

    const coloursInGrid = getColoursCopy(grid);
    let deleted = false;

    for (const [colour, count] of coloursInGrid) {

        if (colour > 0) {

            if (match(colour, count, grid)) deleted = true;
        }
    }

    return deleted;
}

// Match tiles
const match = (colour, count, grid) => {
    let matchCount = count;
    const queue = [];
    const visited = [];
    const rowDirections = [0, -1, 0, 1];
    const columnDirections = [-1, 0, 1, 0];

    let found = false;
    let nodeRow, nodeColumn;
    const size = grid.length;

    // Find the first node of the given colour
    for (nodeRow = 0; nodeRow < size; nodeRow++) {

        for (nodeColumn = 0; nodeColumn < size; nodeColumn++) {

            if (grid[nodeRow][nodeColumn] === colour) {
                found = true;
                break;
            }
        }

        if (found) break;
    }

    if (!found) return;

    const position = new Position(nodeRow, nodeColumn);
    queue.push(position);
    visited.push(position);
    matchCount--;

    while (queue.length > 0) {
        const currentPosition = queue.shift();

        for (let i = 0; i < 4; i++) {
            const possiblePosition = new Position(
                currentPosition.row + rowDirections[i],
                currentPosition.column + columnDirections[i]
            );

            if (isValid(possiblePosition, size) && !positionVisited(possiblePosition, visited)) {

                if (grid[possiblePosition.row][possiblePosition.column] === colour) {
                    queue.push(possiblePosition);
                    visited.push(possiblePosition);
                    matchCount--;
                }
            }
        }
    }

    if (matchCount === 0) {
        deleteMatch(colour, position, grid);
        return true;
    }

    return false;
}

// Delete matched tiles
const deleteMatch = (colour, startingPos, grid) => {
    const queue = [startingPos];
    const rowDirections = [0, -1, 0, 1];
    const columnDirections = [-1, 0, 1, 0];
    const size = grid.length;

    while (queue.length > 0) {
        const currentPosition = queue.shift();
        grid[currentPosition.row][currentPosition.column] = EMPTY;

        for (let i = 0; i < 4; i++) {
            const possiblePosition = new Position(
                currentPosition.row + rowDirections[i],
                currentPosition.column + columnDirections[i]
            );

            if (isValid(possiblePosition, size)) {

                if (grid[possiblePosition.row][possiblePosition.column] === colour) {
                    queue.push(possiblePosition);
                }
            }
        }
    }
}

// Check if posision has been visited
const positionVisited = (position, positions) => {
    return positions.some(p => p.equals(position));
}

// Check if position is valid
const isValid = (position, size) => {
    return position.row >= 0 && position.row < size &&
        position.column >= 0 && position.column < size;
}

// Check if the game has been won
const gameWon = (grid) => {

    const size = grid.length;

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {

            if (grid[i][j] !== 0 && grid[i][j] !== -1) return false;
        }
    }
    return true;
}

// Copy grid
const copy = (grid) => {
    return grid.map(row => [...row]);
}

// Generate unique hash for grid
const hash = (grid) => {
    // FNV-1a 64-bit constants
    let h = 1469598103934665603n;
    const prime = 1099511628211n;

    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {
            const v = BigInt(grid[i][j] + 128);
            h ^= v;
            h *= prime;
        }
    }

    // Mix in number of colours for extra entropy
    h ^= BigInt(getColoursCopy(grid).length);
    h *= prime;

    // Return as string (safe + fast for Set/Map keys)
    return h.toString();
}