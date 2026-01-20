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

const checkMatches = (grid) => {

    const coloursInGrid = getColoursCopy(grid);

    for (const [colour, count] of coloursInGrid) {
        if (colour > 0) {
            match(colour, count, grid);
        }
    }
}

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
    }
}

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

const positionVisited = (position, positions) => {
    return positions.some(p => p.equals(position));
}

const isValid = (position, size) => {
    return position.row >= 0 && position.row < size &&
        position.column >= 0 && position.column < size;
}

const gameWon = (grid) => {

    const size = grid.length;

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {

            if (grid[i][j] !== 0 && grid[i][j] !== -1) {
                return false;
            }
        }
    }
    return true;
}

const copy = (grid) => {
    return grid.map(row => [...row]);
}

const serialize = (grid) => {
    let result = '';
    const size = grid.length;

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {
            result += grid[i][j] + ',';
        }
        result += ';';
    }
    return result;
}