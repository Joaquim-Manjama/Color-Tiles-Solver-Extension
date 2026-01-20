// Listen for messages from index.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkGame') {

    // Try to get canvas
    const canvas = document.querySelector('canvas');
    const game = document.querySelector('color-tiles')

    canvas && game ? sendResponse({ success: true, message: 'Game found' }) : sendResponse({ success: false, error: 'Game not found' });
  }

  if (request.action == 'getBoard') {

    try {
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

      let grid = makeGrid(board);

      move(grid, "UP");
      move(grid, "UP");

      console.log("Grid: ", grid);

      sendResponse({ success: true, board: board, pixels: pixels, movesLeft: movesLeft }); // Return the board, pixels and movesLeft

    } catch (error) {
      console.error('Error in getting elements:', error);
      sendResponse({ success: false }); // Failed
    }
  }

  return true; // Keep message channel open for async response
});