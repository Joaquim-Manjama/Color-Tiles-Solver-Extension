// Listen for messages from index.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // Close solution overlay if opened
  closeSolution();

  if (request.action === 'checkGame') {

    // Try to get canvas
    const canvas = document.querySelector('canvas');
    const game = document.querySelector('color-tiles')

    canvas && game ? sendResponse({ success: true, message: 'Game found' }) : sendResponse({ success: false, error: 'Game not found' });
  }

  if (request.action == 'getBoard') {

    try {
      
      const solution = solvePuzzle();

      // Inject solution
      if (solution[0].length) displaySolution(solution[0].toString().replaceAll(",", ", "), solution[1].toString().replaceAll(",", ", "));

      sendResponse({ success: (solution[0].length > 0) }); // Return response to index.js

    } catch (error) {
      console.error('Error in getting elements:', error);
      sendResponse({ success: false }); // Failed
    }
  }
  return true; // Keep message channel open for async response
});