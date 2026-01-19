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

// map page/client coordinates to canvas pixel coordinates (handles CSS scaling / devicePixelRatio)
const clientToCanvasCoords = (canvas, canvasRect, clientX, clientY) => {
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const cx = Math.round((clientX - canvasRect.left) * scaleX);
    const cy = Math.round((clientY - canvasRect.top) * scaleY);
    return { x: cx, y: cy };
}

// sample a small square and average to reduce anti-aliasing / border effects
const sampleAverage = (ctx, cx, cy, size = 3) => {
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