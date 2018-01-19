

const ROWS = 6;
const COLS = 5;
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;
const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 606;
const ENEMY_ROWS = 3;

const PLAYER_IMAGES = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'];


const BOARD_IMAGES = ['images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png'];

const PRIZE_IMAGES = [
    'images/Gem Green.png',
    'images/Gem Blue.png',
    'images/Gem Orange.png',
    'images/Heart.png',
    'images/Key.png',
    'images/Rock.png',
    'images/Star.png'];

let Component = function(color, x, y) {

        this.x = x;
        this.y = y;
        this.color = color;
}

Component.prototype.render = function(ctx) {}

Component.prototype.canvasJQ = undefined;

Component.prototype.setCanvasJQ = function(canvas) {
    Component.prototype.canvasJQ = $(canvas);
}

let ClickableComponent = function(color, x, y, width, height) {
    Component.call(this, color, x, y);
    this.width = width;
    this.height = height;
    this.lineWidth = 5;
    this.hadFocus = false;
}

ClickableComponent.prototype = Object.create(Component.prototype);
ClickableComponent.prototype.constructor = ClickableComponent;

ClickableComponent.prototype.isMyEvent = function(e) {

    if (e.offsetX < this.x ||
        e.offsetX > this.x + this.width ||
        e.offsetY < this.y ||
        e.offsetY > this.y + this.height)
        return false;
    else
        return true;
}

ClickableComponent.prototype.cursorHandler = function(e) {

    let haveFocus = this.isMyEvent(e);

    if (haveFocus && !this.hadFocus) {
        this.hadFocus = true;
        Component.prototype.canvasJQ.addClass( 'cursor-pointer' );
        return;
    }
    if (!haveFocus && this.hadFocus) {
        this.hadFocus = false;
        Component.prototype.canvasJQ.removeClass( 'cursor-pointer' );
        return;
    }
}

ClickableComponent.prototype.resetCursor = function() {
    Component.prototype.canvasJQ.removeClass( 'cursor-pointer' );
    this.hadFocus = false;
}

let TextComponent = function(color, x, y, text, font) {
    Component.call(this, color, x, y);
    this.text = text;
    this.font = font;
}

TextComponent.prototype = Object.create(Component.prototype);
TextComponent.prototype.constructor = TextComponent;

TextComponent.prototype.render = function(ctx) {

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.fillText(this.text,this.x,this.y);
}

let ClockComponent = function(color, x, y, font) {
    TextComponent.call(this, color, x, y, "0.0 secs", font);
    this.startTime = new Date().getTime();
}

ClockComponent.prototype = Object.create(TextComponent.prototype);
ClockComponent.prototype.constructor = ClockComponent;

ClockComponent.prototype.reset = function() {
    this.text = "0.0 secs"
    this.startTime = new Date().getTime();
}

ClockComponent.prototype.update = function() {
    this.elapsedTime = new Date().getTime() - this.startTime;
    this.text = ((this.elapsedTime/1000).toFixed(1) + " secs") ;
}

let MenuBarComponent = function(color, x, y, bars) {
    ClickableComponent.call(this, color, x, y, 40, 27);
    this.bars = bars;
    this.space = 6;
}

MenuBarComponent.prototype = Object.create(ClickableComponent.prototype);
MenuBarComponent.prototype.constructor = MenuBarComponent;

MenuBarComponent.prototype.render = function(ctx) {

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

MenuBarComponent.prototype.clickHandler = function(e) {

    if (!this.isMyEvent(e))
        return;
   // stop = true;
    $('.game-options').removeClass('hide').addClass('show');
    $('.menu').removeClass('hide').addClass('show');
    $('canvas').addClass('hide');
    this.resetCursor();
}


let RestartComponent = function(color, x, y, radius) {
    ClickableComponent.call(this, color, x, y, radius * 2, radius * 2);
    this.radius = radius;
}

RestartComponent.prototype = Object.create(ClickableComponent.prototype);
RestartComponent.prototype.constructor = RestartComponent;

RestartComponent.prototype.render = function(ctx) {

    let radius = this.radius;
    let x = this.x + radius;
    let y = this.y + radius;
    let start = (Math.PI/180)*360;
    let finish =  (Math.PI/180)*90;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, radius, start, finish, true);
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + radius * .65, y);
    ctx.lineTo(x + 1.35 * radius, y);
    ctx.lineTo(x + radius, y + radius/2);
    ctx.lineTo(x + radius * .65, y);
    ctx.closePath();
    ctx.fill();
}

RestartComponent.prototype.clickHandler = function(e) {

    if (!this.isMyEvent(e)) return;
    game.reset();
    Engine.init();

}

let  GamePiece = function(sprite, row=0, col=0) {
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

GamePiece.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

let Prize = function(img, cell, points, width) {
    GamePiece.call(this, img, cell.row, cell.col);
    this.points = points;
    this.y += Prize.prototype.OFFSET_Y;
    this.width = width;
    this.x += ((CELL_WIDTH - width) * .5);
 }

Prize.prototype = Object.create(GamePiece.prototype);
Prize.prototype.constructor = Prize;
Prize.prototype.OFFSET_Y = 50;

Prize.prototype.reset = function() {
    let cell = game.board.getUnoccupiedCell();
    console.log("cell row:" + cell.row + " col:" + cell.col);
    this.row = cell.row;
    this.col = cell.col;
    this.x = this.col * CELL_WIDTH;
    this.y = this.row * CELL_HEIGHT;
    this.y += Prize.prototype.OFFSET_Y;
    this.x += ((CELL_WIDTH - this.width) * .5);
    console.log(this);
}

// Enemies our player must avoid
let Enemy = function() {
   GamePiece.call(this,
        'images/enemy-bug.png',
        // if there are more than three enemies, assign extra enemy to random row
        Enemy.prototype.enemyCnt <= ENEMY_ROWS? Enemy.prototype.enemyCnt: Enemy.prototype.getRandomRow(),
        0);
    this.x = this.getRandomStartX();
    this.rate = this.getRandomRate();
    this.y -= Enemy.prototype.PIXEL_OFFSET;
    this.id = Enemy.prototype.enemyCnt++;
}

Enemy.prototype = Object.create(GamePiece.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.enemyCnt = 1;
Enemy.prototype.PIXEL_OFFSET = 20;

Enemy.prototype.reset = function() {
        this.x = this.getRandomStartX();
        this.rate = this.getRandomRate();
}

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
let Player = function(spriteImg) {
    GamePiece.call(this, spriteImg, 5, 2);
    this.id = this.getID();
    this.x = CELL_WIDTH * 2;
    this.y += this.PIXEL_OFFSET;
    this.playerJQ = $('.players-li').has(`img[src*='${spriteImg}']`);
    this.playerImgJQ = this.playerJQ.children('img');

    // these handlers are used on the player overlay
    this.playerJQ.click(this.getClickHandler(this));
    this.playerJQ.hover(this.getHoverHandlerIn(this), this.getHoverHandlerOut(this));
}

Player.prototype = Object.create(GamePiece.prototype);
Player.prototype.constructor = Player;

Player.prototype.PIXEL_OFFSET = -18; //-23

Player.prototype.getID = function() {

    let cnt = 0;
    return function() {return cnt++;}
}

Player.prototype.reset = function() {
    this.row = 5;
    this.col = 2;
    this.x = this.col * CELL_WIDTH;
    this.y = this.row * CELL_HEIGHT;
    this.x = CELL_WIDTH * 2;
    this.y += this.PIXEL_OFFSET;
}


Player.prototype.update = function() {}

Player.prototype.deselect = function() {
    this.playerImgJQ.removeClass('player-selected');
}

Player.prototype.select = function() {
    this.playerImgJQ.addClass('player-selected');
}


Player.prototype.getHoverHandlerIn = function(player) {

    return function() {
        if (game.player === player)
            return;
        player.playerImgJQ.addClass('player-img-hover');
    }
}

Player.prototype.getHoverHandlerOut = function(player) {

    return function() {
        player.playerImgJQ.removeClass('player-img-hover');
    }
}


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

Player.prototype.getClickHandler = function(player) {

    return function() {
        game.setPlayer(player);
    }

}

let Board = function() {

    this.board = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
        this.board[row] = [];
        for (let col = 0; col < COLS; col++) {
                this.board[row][col] = 0;
        }
    }
}

Board.prototype.reset = function() {
        for (let row = 0; row < ENEMY_ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                this.board[row][col] = 0;
        }
    }
}

Board.prototype.getUnoccupiedCell = function() {

    let done = false;
    let row, col;

    while (!done) {
        row = GamePiece.prototype.getRandomInt(0,ENEMY_ROWS - 1);
        col = GamePiece.prototype.getRandomInt(0,COLS - 1);
        if (this.board[row][col] === 0) {
            done = true;
            this.board[row][col] = 1;
        }
    }
    row++;
    return {row, col};
}



let Game = function(global) {

    function attachCloseIconHandler() {
        closeIconJQ = $( '.close-x');
        closeIconJQ.click(function() {
            $( '.game-options' ).removeClass( 'show' ).addClass( 'hide' );
            $( 'canvas' ).removeClass( 'hide' ).addClass( 'show' );

            Engine.init();
            });
    }

    function attachMenuHandlers() {

        // get DOM
        let menuItemJQ = $( '.menu-li:contains(Players)' );
        let playerOverlayJQ = $( '.players-ul' );
        menuItemJQ.click(function() {
            playerOverlayJQ.removeClass( 'hide' ).addClass( 'show' );
            menuItemJQ.addClass( 'white-text' );
        });
    }

    function createPlayers() {

        let players = [];
        for (let i = 0; i < PLAYER_IMAGES.length; i++) {
            players.push(new Player(PLAYER_IMAGES[i]));
        }
        return players;
    }

    function createEnemies(enemyCnt) {

        let enemies = [];
        for (let i = 0; i < enemyCnt; i++) {
               enemies.push(new Enemy());
        }
        return enemies;
    }

    function createPrizes(board) {

        let prizes = [];

        prizes.push(new Prize('images/Gem Green.png', board.getUnoccupiedCell(), 10, 80));
        prizes.push(new Prize('images/Gem Blue.png', board.getUnoccupiedCell(), 10, 78));
        prizes.push(new Prize('images/Gem Orange.png', board.getUnoccupiedCell(), 10, 77));
        prizes.push(new Prize('images/Heart.png', board.getUnoccupiedCell(), 10, 82));
        prizes.push(new Prize('images/Key.png', board.getUnoccupiedCell(), 10, 49));
        prizes.push(new Prize('images/Rock.png', board.getUnoccupiedCell(), -10, 77));
        prizes.push(new Prize('images/Star.png', board.getUnoccupiedCell(), 10, 88));
        return prizes;
    }

    function createCanvas() {
        let doc = global.document;
        canvas = doc.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        doc.body.appendChild(canvas);

        Component.prototype.setCanvasJQ(canvas);

        canvas.addEventListener('click', function(e) {
            game.menuBarComponent.clickHandler(e);
        });
        canvas.addEventListener('click', function(e) {
            game.restartComponent.clickHandler(e);
        });
        canvas.addEventListener('mousemove', function(e) {
            game.menuBarComponent.cursorHandler(e);
        });

        canvas.addEventListener('mousemove', function(e) {
            game.restartComponent.cursorHandler(e);
        });
        return canvas;
    }


    this.renderables = [];
    this.updateables = [];
    this.prizes = [];

    this.restartComponent = new RestartComponent("#1ebb1e", 5, 16, 13);
    this.renderables.push(this.restartComponent);
    this.menuBarComponent = new MenuBarComponent("#1ebb1e", CANVAS_WIDTH - 45, 20, 3);
    this.renderables.push(this.menuBarComponent);
    this.titleComponent = new TextComponent("#1ebb1e", CANVAS_WIDTH/2, 40, "Bug Speedway",
        "25px Comic Sans ms");
    this.renderables.push(this.titleComponent);
    this.clockComponent = new ClockComponent("#ccc", CELL_WIDTH, 40, "15px Comic Sans ms");
    this.renderables.push(this.clockComponent);
    this.updateables.push(this.clockComponent);
    this.players = createPlayers();
    this.player = this.players[0];
    this.renderables.push(this.player);
    this.updateables.push(this.player);
    this.enemies = createEnemies(5);
    this.board = new Board();
    this.prizes = createPrizes(this.board);
    this.renderables = this.renderables.concat(this.prizes);
    this.canvas = createCanvas();
    attachMenuHandlers();
    attachCloseIconHandler();



    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

    game.players[0].handleInput(allowedKeys[e.keyCode]);
    });
}

Game.prototype.getRenderables = function() {
    return this.renderables;
}

Game.prototype.getUpdateables = function() {
    return this.updateables;
}

Game.prototype.getCanvas = function() {
    return this.canvas;
}

Game.prototype.setPlayer = function(player) {
    this.player.deselect();
    this.player = player;
    this.player.select();
}

Game.prototype.getEnemies = function() {
    return this.enemies;
}

Game.prototype.reset = function() {
    // stop engine
    Engine.stop();
 // reset player
    this.player.reset();
// reset prizes
    this.board.reset();
    for (let i = 0; i < this.prizes.length; i++)
        this.prizes[i].reset();
// reset clock
    this.clockComponent.reset();
// reset enemies
    for (let i = 0; i < this.enemies.length; i++)
        this.enemies[i].reset();
    Engine.init();
}

Game.prototype.getPlayer = function() {
    return this.player;
}
/*
Game.prototype.getMenuBar = function() {
    return this.menuBarComponent;
}

Game.prototype.getTitle = function() {
    return this.titleComponent;
}

Game.prototype.getRestartButton = function() {
    return this.restartComponent;
}*/


