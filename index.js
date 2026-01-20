// Main DOM elements
const description = document.getElementById('description');
const openButton = document.getElementById('openBtn');
const solveButton = document.getElementById('solveBtn');
const status = document.getElementById('status');
const solutionContainer = document.getElementById('solution');
const solutionText = document.getElementById('solutionText');

// Initial UI state
solveButton.style.display = 'none';
solutionContainer.style.display = 'none';

// Check if game is present on page after DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'checkGame' });

  if (response.success) {

    // Game detected UI update
    description.textContent = 'Game detected! Ready to solve.';
    solveButton.style.display = 'block';
    openButton.style.display = 'none';
  }

});

solveButton.addEventListener('click', async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const response = await chrome.tabs.sendMessage(tab.id, { action: 'getBoard' })

  if (response.success) {

    const board = response.board;
    const pixels = response.pixels;
    const movesLeft = response.movesLeft;

    console.log('Pixels: ', pixels);
    console.log('Board: ', board);
    console.log('Moves left: ', movesLeft);

  }
});