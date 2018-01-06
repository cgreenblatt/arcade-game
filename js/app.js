let Component = function(color, x, y) {

        this.x = x;
        this.y = y;
        this.color = color;
}

Component.prototype.render = function(ctx) {}

let TitleComponent = function(color, x, y, text) {
    Component.call(this, color, x, y);
    this.text = text;
}

TitleComponent.prototype = Object.create(Component.prototype);
TitleComponent.prototype.constructor = TitleComponent;

TitleComponent.prototype.render = function(ctx) {

        ctx.font = "32px Comic Sans MS";
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.fillText(this.text,this.x,this.y);
}

let MenuComponent = function(color, x, y, bars) {
    Component.call(this, color, x, y);
    this.bars = bars;
    this.space = 6;
    this.lineWidth = 5;
    this.width = 40;
}

MenuComponent.prototype = Object.create(Component.prototype);
MenuComponent.prototype.constructor = MenuComponent;

MenuComponent.prototype.render = function(ctx) {

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    let y = this.y;
    for (i = 0; i < this.bars; i++) {
        ctx.moveTo(this.x, y);
        ctx.lineTo(this.x + this.width, y);
        ctx.stroke();
        y += this.lineWidth + this.space;
    }
}

MenuComponent.prototype.handleInput = function(e) {

    if (e.offsetX < this.x ||
        e.offsetX > e.offsetX + this.width ||
        e.offsetY < this.y ||
        e.offsetY > this.y + this.bars * this.lineWidth + (this.bars - 1) * this.space)
        return;
    stop = true;
    $('.menu').removeClass('hide').addClass('show');
    $('canvas').addClass('hide');
    console.log(e);

}


let  GamePiece = function(sprite, row, col) {
    this.sprite = sprite;
    this.row = row;
    this.col = col;
    this.x = col * CELL_WIDTH;
    this.y = row * CELL_HEIGHT;
}

GamePiece.prototype.getCell = function() {
    return {
        col: this.col,
        row: this.row,
    };
}

// stackoverflow 1527803
GamePiece.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Enemies our player must avoid
let Enemy = function() {
    GamePiece.call(this,
        'images/enemy-bug.png',
        // if there are more than three enemies, assign extra enemy to random row
        Enemy.prototype.enemyCnt <= ENEMY_ROWS? Enemy.prototype.enemyCnt: Enemy.prototype.getRandomRow(),
        0);

    this.y -= Enemy.prototype.PIXEL_OFFSET;
    this.x = this.getRandomStartX();
    this.id = Enemy.prototype.enemyCnt++;
    this.rate = this.getRandomRate();

    console.log(this.x + " " + this.y);
}

Enemy.prototype = Object.create(GamePiece.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.enemyCnt = 1;
Enemy.prototype.PIXEL_OFFSET = 20;

Enemy.prototype.getRandomRow = function() {

    return GamePiece.prototype.getRandomInt(1, ENEMY_ROWS);
}

Enemy.prototype.getNewY = function(row) {

    return row * CELL_HEIGHT - Enemy.prototype.PIXEL_OFFSET;
}

Enemy.prototype.getCell = function() {
    return {
        row: this.row,
        col: Math.round(this.x/CELL_WIDTH)};
}

Enemy.prototype.getRandomStartX = function() {
    return -(this.getRandomInt(0, 1000));
}

Enemy.prototype.getRandomRate = function() {
    return 50 + this.getRandomInt(0, 300);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += (this.rate * dt);
    // if enemy is now off canvas
    if (this.x > CANVAS_WIDTH) {
        this.x = this.getRandomStartX();
        // if enemy id is > 3, assign this enemy to new random row
        if (this.id > ENEMY_ROWS) {
            this.row = this.getRandomRow();
            // get new y position based on new random row
            this.y = this.getNewY(this.row);
        }
        // get new rate of speed
        this.rate = this.getRandomRate();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

let Player = function() {
    GamePiece.call(this, 'images/char-cat-girl.png', 5, 2);
    this.x = CELL_WIDTH * 2;
    this.y += this.PIXEL_OFFSET;
}

Player.prototype = Object.create(GamePiece.prototype);
Player.prototype.constructor = Player;

Player.prototype.PIXEL_OFFSET = -23;

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

/*$('canvas').click(function(e) {
        menu.handleInput(e);
    }
);*/

