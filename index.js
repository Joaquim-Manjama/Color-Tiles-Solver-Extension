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

/**
 * const canvas = document.querySelector('canvas');
  const puzzle = document.querySelector('.puzzle-spacer');
  const levelDiv = document.querySelector('.current-level');
  const currentLevel = levelDiv ? parseInt(levelDiv.textContent.split(' ')[0], 10) : 1;
*/

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
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      
      try {
        const canvas = document.querySelector('canvas');
        const puzzle = document.querySelector('.puzzle-spacer');
        const levelDiv = document.querySelector('.current-level');
        const currentLevel = levelDiv ? parseInt(levelDiv.textContent.split(' ')[0], 10) : 0;
        const movesLeftElement = document.getElementById('moves-left');
        const movesLeft = movesLeftElement ? parseInt(movesLeftElement.textContent, 10) : 0;

       return { "canvas": canvas, "puzzle": puzzle, "currentLevel": currentLevel, "movesLeft": movesLeft };
      
      } catch (error) {
        console.error('Error in injected script:', error);
        description.textContent = 'An error occurred while trying to solve the puzzle.';
        return { error: error.message  };
      }
    }

  }, (results) => {
    
    console.log('Results from injected script:', results);

    // Important constants
    const { canvas, puzzle, currentLevel, movesLeft, error } = results[0].result;
  });
});


// Helper functions
// Get number of cells based on level
const getNumberOfCells = (level) => {

    if (typeof level !== 'number') return;

    if (level >= 14) return 9;
    if (level >= 13) return 8;
    if (level >= 10) return 7;
    if (level >= 8) return 6;
    if (level >= 6) return 5;
    if (level >= 2) return 4;

    return 3;
}