// convert RGB to HSL (r,g,b in 0..255) -> {h:0..360, s:0..1, l:0..1}
const rgbToHsl = (r, g, b) => {
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
const classifyColor = (input) => {
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

    // Brown: (38-42, 80-85, 67-70)
    if (h >= 33 && h <= 47 && s >= 0.75 && s <= 0.90 && l >= 0.62 && l <= 0.75) return 'brown';

    // Red: (5-10, 56-68, 45-54)
    if (h >= 0 && h <= 20 && s >= 0.46 && s <= 0.78 && l >= 0.35 && l <= 0.64) return 'red';

    // Yellow: (39-44, 85-100, 46-67)
    if (h >= 31 && h <= 54 && s >= 0.75 && s <= 1.0 && l >= 0.36 && l <= 0.77) return 'yellow';

    // Blue: (216-242, 49-93, 45-65)
    if (h >= 211 && h <= 247 && s >= 0.44 && s <= 1.0 && l >= 0.40 && l <= 0.70) return 'blue';

    // Green: (56-67, 44-60, 36-46)
    if (h >= 51 && h <= 72 && s >= 0.39 && s <= 0.65 && l >= 0.31 && l <= 0.51) return 'green';

    // Orange: (30-38, 96-100, 30-47)
    if (h >= 25 && h <= 43 && s >= 0.91 && s <= 1.0 && l >= 0.25 && l <= 0.52) return 'orange';

    // Light Blue: (171-179, 49-100, 29-60)
    if (h >= 164 && h <= 184 && s >= 0.44 && s <= 1.0 && l >= 0.24 && l <= 0.65) return 'light blue';

    // Purple: (264-288, 45-73, 43-67)
    if (h >= 259 && h <= 293 && s >= 0.40 && s <= 0.78 && l >= 0.38 && l <= 0.72) return 'purple';

    // Gray: (228-330, 1-6, 30-53)
    if (h >= 223 && h <= 335 && s >= 0.01 && s <= 0.11 && l >= 0.25 && l <= 0.58) return 'gray';

    // White: (235-300, 2-33, 65-95)
    if (h >= 230 && h <= 305 && s >= 0.02 && s <= 0.38 && l >= 0.60 && l <= 1.0) return 'white';

    return 'unknown';
}

// Get colour id
const getColourId = (colour) => {
  const labels = {  "green": -1, "brown": 0, "red": 1, "yellow": 2, 
                    "blue": 3, "orange": 4, "light blue": 5, "purple": 6, 
                    "gray": 7, "white": 8
    }

  return labels[colour] ? labels[colour] : 69;
}