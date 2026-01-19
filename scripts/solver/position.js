const BLOCK = -1;
const EMPTY = 0;

class Position {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    equals(position) {
        return (this.row == position.row && this.column == position.column);
    }
}