// Getting DOM elements
const canvas = document.querySelector('canvas');
const puzzle = document.querySelector('.puzzle-spacer');
const levelDiv = document.querySelector('.current-level');

const currentLevel = levelDiv ? parseInt(levelDiv.textContent.split(' ')[0], 10) : 1;

if (!canvas) {
    console.error('No <canvas> element found on the page.');
}
if (!puzzle) {
    console.error('No element with class .puzzle-spacer found on the page.');
}

const puzzleRect = puzzle.getBoundingClientRect();
const canvasRect = canvas.getBoundingClientRect();

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

// Calculate board and cell dimensions
const BOARD_SIZE = puzzleRect.width;
const BOARD_X = puzzleRect.left;
const BOARD_Y = puzzleRect.top;
const CELLS = getNumberOfCells(currentLevel) || 3;
const cellSize = BOARD_SIZE / CELLS;

const ctx = canvas.getContext('2d');
let pixels = [];

console.log('Board X:', BOARD_X, 'Board Y:', BOARD_Y, 'Cell Size:', cellSize);

// map page/client coordinates to canvas pixel coordinates (handles CSS scaling / devicePixelRatio)
function clientToCanvasCoords(canvas, canvasRect, clientX, clientY) {
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const cx = Math.round((clientX - canvasRect.left) * scaleX);
    const cy = Math.round((clientY - canvasRect.top) * scaleY);
    return { x: cx, y: cy };
}

// sample a small square and average to reduce anti-aliasing / border effects
function sampleAverage(ctx, cx, cy, size = 3) {
    const half = Math.floor(size / 2);
    let r = 0, g = 0, b = 0, count = 0;
    try {
        for (let dx = -half; dx <= half; dx++) {
            for (let dy = -half; dy <= half; dy++) {
                const sx = cx + dx;
                const sy = cy + dy;
                if (sx < 0 || sy < 0 || sx >= ctx.canvas.width || sy >= ctx.canvas.height) continue;
                const d = ctx.getImageData(sx, sy, 1, 1).data;
                r += d[0];
                g += d[1];
                b += d[2];
                count++;
            }
        }
    } catch (err) {
        console.error('Error sampling canvas (possible cross-origin/tainted canvas?):', err);
        return null;
    }
    if (count === 0) return null;
    return [ Math.round(r / count), Math.round(g / count), Math.round(b / count) ];
}

// convert RGB to HSL (r,g,b in 0..255) -> {h:0..360, s:0..1, l:0..1}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s, l };
}

// classify into: brown, red, yellow, blue, green, orange, light blue, purple, gray, white
function classifyColor(input) {
    let r, g, b;
    if (Array.isArray(input)) {
        [r, g, b] = input;
    } else if (typeof input === 'object' && input !== null) {
        ({ r, g, b } = input);
    } else if (typeof input === 'string') {
        // accept '#rrggbb' or 'rgb(r,g,b)'
        if (input[0] === '#') {
            const hex = input.slice(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                r = parseInt(hex.slice(0,2), 16);
                g = parseInt(hex.slice(2,4), 16);
                b = parseInt(hex.slice(4,6), 16);
            }
        } else if (input.startsWith('rgb')) {
            const parts = input.match(/\d+/g).map(Number);
            [r, g, b] = parts;
        }
    }
    if ([r,g,b].some(v => v === undefined || Number.isNaN(v))) return 'unknown';

    const { h, s, l } = rgbToHsl(r, g, b);

    // Classification based on HSL ranges +/-

    // Red: (5-10, 56-68, 45-54)
    if (h >= 0 && h <= 20 && s >= 0.46 && s <= 0.78 && l >= 0.35 && l <= 0.64) return 'red';

    // Orange: (30-38, 96-100, 30-47)
    if (h >= 25 && h <= 43 && s >= 0.91 && s <= 1.0 && l >= 0.25 && l <= 0.52) return 'orange';

    // Brown: (38-42, 80-85, 67-70)
    if (h >= 33 && h <= 47 && s >= 0.75 && s <= 0.90 && l >= 0.62 && l <= 0.75) return 'brown';

     // Yellow: (39-44, 85-100, 46-67)
    if (h >= 29 && h <= 54 && s >= 0.75 && s <= 1.0 && l >= 0.36 && l <= 0.77) return 'yellow';

     // Green: (56-67, 44-60, 36-46)
    if (h >= 51 && h <= 72 && s >= 0.39 && s <= 0.65 && l >= 0.31 && l <= 0.51) return 'green';

    // Light Blue: (171-179, 49-100, 29-60)
    if (h >= 164 && h <= 184 && s >= 0.44 && s <= 1.0 && l >= 0.24 && l <= 0.65) return 'light blue';

    // Blue: (216-242, 49-93, 45-65)
    if (h >= 211 && h <= 247 && s >= 0.44 && s <= 1.0 && l >= 0.40 && l <= 0.70) return 'blue';

        // Gray: (228-330, 1-6, 30-53)
    if (h >= 223 && h <= 335 && s >= 0.01 && s <= 0.11 && l >= 0.25 && l <= 0.58) return 'gray';
    
    // White: (235-300, 2-33, 65-95)
    if (h >= 230 && h <= 305 && s >= 0.02 && s <= 0.38 && l >= 0.60 && l <= 1.0) return 'white';
    
    // Purple: (264-288, 45-73, 43-67)
    if (h >= 259 && h <= 293 && s >= 0.40 && s <= 0.78 && l >= 0.38 && l <= 0.72) return 'purple';
    
    return 'unknown';
}

// iterate board cells, sample and classify
for (let i = 0; i < CELLS; i++) {
    for (let j = 0; j < CELLS; j++) {
        const clientX = BOARD_X + (j * cellSize) + (cellSize / 2);
        const clientY = BOARD_Y + (i * cellSize) + (cellSize / 2);
        const { x: cx, y: cy } = clientToCanvasCoords(clientX, clientY);
    const sampled = sampleAverage(ctx, cx, cy, 3);
        if (!sampled) {
            console.log(`cell ${i},${j}: could not sample`);
            pixels.push(null);
            continue;
        }
        const label = classifyColor(sampled);
        console.log(`cell ${i},${j}: rgb=${sampled.join(',')} -> ${label}`);
        pixels.push(sampled);
    }
}

console.log('sampled pixels:', pixels);