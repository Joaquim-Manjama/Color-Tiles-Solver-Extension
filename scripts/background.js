chrome.action.onClicked.addListener((originalTab) => {
  console.log("Extension icon clicked!");

  const gameUrl = "https://dailygames.discover.google.com/games/color-tiles?immersive=1&hl=en";

  chrome.tabs.create({ url: gameUrl, active: false }, (newTab) => {
    console.log("Background tab created:", newTab.id);
    
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        console.log("Background tab loaded!");
        
        // Briefly activate the tab to trigger game initialization
        chrome.tabs.update(newTab.id, { active: true }, () => {
          
          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: () => {
                const waitForElements = (maxAttempts = 30) => {
                  return new Promise((resolve) => {
                    let attempts = 0;
                    const check = setInterval(() => {
                      const gameCanvas = document.querySelector('canvas');
                      const puzzle = document.querySelector('.puzzle-spacer');
                      attempts++;
                      
                      if (gameCanvas && puzzle) {
                        clearInterval(check);
                        resolve({ gameCanvas, puzzle });
                      } else if (attempts >= maxAttempts) {
                        clearInterval(check);
                        resolve(null);
                      }
                    }, 200);
                  });
                };
                
                return waitForElements().then(elements => {
                  if (elements) {
                    return {
                      found: true,
                      canvas: {
                        width: elements.gameCanvas.width,
                        height: elements.gameCanvas.height,
                        outerHTML: elements.gameCanvas.outerHTML
                      },
                      puzzle: {
                        outerHTML: elements.puzzle.outerHTML,
                        innerHTML: elements.puzzle.innerHTML
                      }
                    };
                  } else {
                    return { found: false };
                  }
                });
              }
            }).then((results) => {
              console.log("Elements data:", results[0].result);
              
              const elementsData = results[0].result;
              
              // Switch back to original tab
              chrome.tabs.update(originalTab.id, { active: true }, () => {
                // Then close the game tab
                chrome.tabs.remove(newTab.id, () => {
                  console.log("Game tab closed");
                  
                  // Send data to original tab
                  chrome.scripting.executeScript({
                    target: { tabId: originalTab.id },
                    func: (data) => {
                      alert("Elements received!\nCanvas: " + data.canvas.width + "x" + data.canvas.height);
                      console.log("Received data:", data);
                    },
                    args: [elementsData]
                  });
                });
              });
              
            }).catch((err) => {
              console.error("Script error:", err);
              chrome.tabs.remove(newTab.id);
            });
          }, 1500);
          
        });
        
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});