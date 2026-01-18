// Listen for messages from index.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkGame') {

    // Try to get canvas
    const canvas = document.querySelector('canvas');

    canvas ? sendResponse({ success: true, message: 'Canvas found' }) : sendResponse({ success: false, error: 'Canvas not found' });
  }
  
  return true; // Keep message channel open for async response
});