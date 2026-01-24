const solvePuzzle = () => {
    // Get the Game elements
    const canvas = document.querySelector('canvas');
    const puzzle = document.querySelector('.puzzle-spacer');
    const levelDiv = document.querySelector('.current-level');
    const currentLevel = levelDiv ? parseInt(levelDiv.textContent.split(' ')[0], 10) : 0;
    const movesLeftElement = document.getElementById('moves-left');
    const movesLeft = movesLeftElement ? parseInt(movesLeftElement.textContent, 10) : 0;

    const canvasRect = canvas?.getBoundingClientRect();
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    const boardSize = puzzle?.getBoundingClientRect().width;
    const boardx = puzzle?.getBoundingClientRect().left;
    const boardy = puzzle?.getBoundingClientRect().top;

    const cells = getNumberOfCells(currentLevel);
    const cellSize = boardSize / cells;

    let pixels = [];
    let board = [];

    // iterate board cells, sample and classify
    for (let i = 0; i < cells; i++) {

        for (let j = 0; j < cells; j++) {
            const clientX = boardx + (j * cellSize) + (cellSize / 2);
            const clientY = boardy + (i * cellSize) + (cellSize / 2);
            const { x: cx, y: cy } = clientToCanvasCoords(canvas, canvasRect, clientX, clientY);
            const sampled = sampleAverage(ctx, cx, cy, 3);

            if (!sampled) {
                console.log(`cell ${i},${j}: could not sample`);
                pixels.push(null);
                board.push(69);
                continue;
            }
            
            const label = classifyColor(sampled);
            pixels.push(label);
            board.push(getColourId(label));
        }
    }

    // Convert the board into a 2x2 grid
    let grid = makeGrid(board);

    let solution = [];

    // Solve the grid
    try {
        solution = solve(grid, movesLeft);

    } catch (error) {
        console.error("Error solving the puzzle! :(", error);
    }
    
    return [solution, pixels];
}