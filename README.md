# Color Tiles Solver - Chrome Extension

A Chrome extension that calculates the solutions for Google's Color Tiles puzzle game using a breadth-first search algorithm.

## 🎮 What is Color Tiles?

Color Tiles is a puzzle game available on Google Search where you must match all tiles to the same color by making strategic moves. Each move changes the color of adjacent tiles, creating a challenging logic puzzle.

## ✨ Features

- **Automatic Puzzle Detection**: Detects when you're playing Color Tiles
- **Smart Solving Algorithm**: Uses BFS to find the optimal solution
- **Instant Results**: Displays solution as a sequence of moves (e.g., "LEFT, UP, RIGHT, DOWN")
- **Clean Interface**: Simple popup UI with one-click solving
- **No External Dependencies**: Everything runs locally in your browser

## 🚀 Installation

### From Source (Developer Mode)

1. Clone this repository:
```bash
   git clone https://github.com/Joaquim-Manjama/Color-Tiles-Solver-Extension.git
   cd color-tiles-solver
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked**

5. Select the extension folder

6. The Color Tiles Solver icon should now appear in your extensions toolbar

## 📖 Usage

1. Open the Color Tiles game:
   - Search "color tiles" on Google, OR
   - Go directly to: https://dailygames.discover.google.com/games/color-tiles

2. Click the extension icon in your toolbar

3. Click **"Solve Current Puzzle"**

4. The solution will appear showing the sequence of moves needed

5. Execute the moves in the game to win!
