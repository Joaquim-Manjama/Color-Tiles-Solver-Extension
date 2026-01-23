// Move the board in a given direction
const move = (grid, direction) => {

    switch (direction) {
        case "LEFT":
            console.log("Move Left!");
            left(grid);
            break;

        case "UP":
            console.log("Move Up!");
            up(grid);
            break;

        case "RIGHT":
            console.log("Move Right");
            right(grid);
            break;

        case "DOWN":
            console.log("Move Down!");
            down(grid);
            break;

        default:
            break;
    }

    return checkMatches(grid);
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
const left = (grid) => {

    let space;
    const size = grid.length;

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
const right = (grid) => {

    let space;
    const size = grid.length;

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
const up = (grid) => {

    let space;
    const size = grid.length;

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
const down = (grid) => {

    let space;
    const size = grid.length;

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