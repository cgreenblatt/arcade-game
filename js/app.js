
// Enemies our player must avoid
let Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';
    this.id = Enemy.prototype.enemyCnt++;
    console.log(this.id);
    this.x = this.getNewX();

    if (this.id <= ENEMY_ROWS)
        this.row = this.id;
    else
        this.row = this.getNewRow();

    this.y = this.getNewY(this.row);
    this.rate = this.getNewRate();

    console.log(this.x + " " + this.y);
    console.log("player offset ***** " + Player.prototype.OFFSET++);
};

Enemy.prototype.enemyCnt = 1;

// stackoverflow 1527803
Enemy.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Enemy.prototype.getNewRow = function() {

    let row = this.getRandomInt(1, ENEMY_ROWS);
    console.log("row is " + row);
    return row;
}

Enemy.prototype.getRow = function() {
    return this.row;
}

Enemy.prototype.getNewY = function(row) {

    let y = row * CELL_HEIGHT - 20;
    console.log("y is " + y);
    return y;
}

Enemy.prototype.getCell = function() {
    return {
        row: this.row,
        col: Math.round(this.x/CELL_WIDTH)};
}

Enemy.prototype.getNewX = function() {
    return -(this.getRandomInt(0, 1000));
}

Enemy.prototype.getNewRate = function() {
    return 50 + this.getRandomInt(0, 300);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += (this.rate * dt);
    if (this.x > CANVAS_WIDTH) {
        this.x = 0;
    if (this.id > ENEMY_ROWS)
        this.row = this.getNewRow();
    this.y = this.getNewY(this.row);
    this.rate = this.getNewRate();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = CELL_WIDTH * 2;
    this.y = CELL_HEIGHT * 4 + this.OFFSET;
    this.row = 5;
    this.col = 2;
}

Player.prototype.OFFSET = 50;

Player.prototype.getCell = function() {
   return {
        row: this.row,
        col: this.col}
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {}

Player.prototype.handleInput = function(key) {

    switch(key) {
        case 'left':
            if (this.col > 0) {
                this.x -= CELL_WIDTH;
                this.col--;
            }
            break;
        case 'up':
            if (this.row > 0) {
                this.y -= CELL_HEIGHT;
                this.row--;
            }
            break;
        case 'right':
            if (this.col < 4) {
                this.x += CELL_WIDTH;
                this.col++;
            }

            break;
        case 'down':
            if (this.row < 5) {
                this.y += CELL_HEIGHT;
                this.row++;
            }
            break;
    }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
