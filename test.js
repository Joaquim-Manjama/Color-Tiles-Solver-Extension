const canvas = document.querySelector('canvas');
const puzzle = document.querySelector('.puzzle-spacer');

const puzzleDimensions = puzzle.getBoundingClientRect();
const WIDTH = puzzleDimensions.width;
const HEIGHT = puzzleDimensions.height;

const BOARD_SIZE = puzzleDimensions.width;
const BOARD_X = puzzleDimensions.x;
const BOARD_Y = puzzleDimensions.y;

const cellSize = BOARD_SIZE / 3;

const ctx = canvas.getContext('2d');
let pixels = [];

console.log("Board X:", BOARD_X, "Board Y:", BOARD_Y, "Cell Size:", cellSize);

for (let i = 0; i < 3; i++) {

    for (let j = 0; j < 3; j++) {
    
        const x = BOARD_X + (j * cellSize) + (cellSize / 2);
        const y = BOARD_Y + (i * cellSize) + (cellSize / 2);
        console.log("x:", x, "y:", y, " ");
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        pixels.push([ pixel[0], pixel[1], pixel[2]]);
    }
    console.log("\n");
}

console.log(pixels);

