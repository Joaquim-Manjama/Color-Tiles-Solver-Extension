// Move the board in a given direction
const move = (grid, size, direction) => {
    
    switch (direction) {
        case "LEFT":
            left(grid, size);
            break;

        case "UP":
            up(grid, size);
            break;

        case "RIGHT":
            right(grid, size);
            break;

        case "DOWN":
            down(grid, size);
            break;

        default:
            break;
    }

    checkMatches();

    if (verbose) display();
}

// Undo Move
const undo = (direction) => {
    
    switch (direction) {
        case "LEFT":
            move("RIGHT");
            break;

        case "UP":
            move("DOWN");
            break;

        case "RIGHT":
            move("LEFT");
            break;

        case "DOWN":
            move("UP");
            break;

        default:
            break;
    }
}

// Move grid left
const left = (grid, size) => {

    let space;

    for (let i = 0; i < size; i++) {

        space = false;

        for (let j = 0; j < size; j++) {

            if (space) {

                if (grid[i][j] != BLOCK) {

                    grid[i][j - 1] = grid[i][j];
                    grid[i][j] = EMPTY;
                
                } else space = false;
            }

            if (grid[i][j] == EMPTY) space = true;
        }
    }
}


// Move grid right
const right = (grid, size) => {
    
    let space;

    for (let i = 0; i < size; i++) {
        
        space = false;

        for (let j = size - 1; j >= 0; j--) {

            if (space) {
                
                if (grid[i][j] != BLOCK) {

                    grid[i][j + 1] = grid[i][j];
                    grid[i][j] = EMPTY;
                
                } else space = false;
            }

            if (grid[i][j] == EMPTY) space = true;
        }
    }
}

// Move grid up
const up = (grid, size) => {
    
    let space;

    for (let i = 0; i < size; i++) {
        space = false;

        for (let j = 0; j < size; j++) {

            if (space) {
                
                if (grid[j][i] != BLOCK) {
                    
                    grid[j - 1][i] = grid[j][i];
                    grid[j][i] = EMPTY;
                
                } else space = false;
            }

            if (grid[j][i] == EMPTY) space = true;
        }
    }
}

// Move grid down
const down = (grid, size) => {
    
    let space;

    for (let i = 0; i < size; i++) {
        space = false;

        for (let j = size - 1; j >= 0; j--) {

            if (space) {
                
                if (grid[j][i] != BLOCK) {
                    
                    grid[j + 1][i] = grid[j][i];
                    grid[j][i] = EMPTY;
                
                } else space = false;
            }

            if (grid[j][i] == EMPTY) space = true;
        }
    }
}