

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

/**
*  @constructor: Represents something to draw on the canvas at coordinates x, y
* @param {number} x - The x coordinate of the component
* @param {number} y - The y coordinate of the component
*/
let Component = function(x, y) {
        this.x = x;
        this.y = y;
};

/**
* @constructor Represents something to draw on the canvas that is clickable
* @param {string} color - The color of the component
* @param {number} x - The x coordinate of the component
* @param {number} y - The y coordinate of the component
* @param {number} width - The width in pixels of the component
* @param {number} height - The height in pixels of the component
*/
let ClickableComponent = function(color, x, y, width, height) {
    Component.call(this, x, y);
    this.color = color;
    this.width = width;
    this.height = height;
    this.lineWidth = 5;
    this.hadFocus = false;
};

ClickableComponent.prototype = Object.create(Component.prototype);
ClickableComponent.prototype.constructor = ClickableComponent;

/**
* @description Determines if this ClickableComponent should respond to the event parameter by
    checking if the event occurred within its boundaries
* @param {event} e - An event
* @return {boolean} true if this ClickableComponent should respond to the event parameter
*/
ClickableComponent.prototype.isMyEvent = function(e) {
    if (e.offsetX < this.x ||
        e.offsetX > this.x + this.width ||
        e.offsetY < this.y ||
        e.offsetY > this.y + this.height)
        return false;
    else
        return true;
};

/**
* @description Changes the cursor to a pointer if the cursor is over this ClickableComponent,
    changes the cursor from a pointer to the default if the cursor moves off this ClickableComponent,
* @param {event} e - A mousemove event
*/
ClickableComponent.prototype.cursorHandler = function(e) {
    let haveFocus = this.isMyEvent(e);

    if (haveFocus && !this.hadFocus) {
        this.hadFocus = true;
        game.canvasJQ.addClass( 'cursor-pointer' );
        return;
    }
    if (!haveFocus && this.hadFocus) {
        this.hadFocus = false;
        game.canvasJQ.removeClass( 'cursor-pointer' );
        return;
    }
};

/**
* @constructor Represents a text component to draw on the canvas
* @param {string} color - The color used to draw the component
* @param {number} x - The x coordinate of the component
* @param {number} y - The y coordinate of the component
* @param {string} text - The text to draw
* @param {string} font - The font used to draw the text
*/
let TextComponent = function(color, x, y, text, font) {
    Component.call(this, x, y);
    this.color = color;
    this.text = text;
    this.font = font;
};

TextComponent.prototype = Object.create(Component.prototype);
TextComponent.prototype.constructor = TextComponent;

/**
* @description Draws this TextComponent on the canvas
* @param: {object} ctx - The canvas rendering context object
*/
TextComponent.prototype.render = function(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.fillText(this.text,this.x,this.y);
};

/**
* @constructor Represents the score to draw on the canvas
* @param {string} - The color used to draw the component
* @param {x} x - The x coordinate of the component
* @param {y} y - The y coordinate of the component
* @param {string} font - The font used to draw the string
*/
let ScoreComponent = function(color, x, y, font) {
    TextComponent.call(this, color, x, y, "0 points", font);
    this.points = 0;
};

ScoreComponent.prototype = Object.create(TextComponent.prototype);
ScoreComponent.prototype.constructor = ScoreComponent;

/**
* @description Updates the text for the score component
* @param: {number} - The points to add to the player's score
*/
ScoreComponent.prototype.update = function(points) {
    this.points += points;
    this.text = this.points + " points";
};

/**
* @description Resets the score text to "O points"
*/
ScoreComponent.prototype.reset = function() {
    this.points = 0;
    this.text = this.points + " points";
};

/**
* @constructor Represents the score to draw on the canvas
* @param {color} color - the color used to draw the score
* @param {x} x - The x coordinate of the component
* @param {y} y - The y coordinate of the component
* @param {string} font - The font used to draw the score
*/
let ClockComponent = function(color, x, y, font) {
    TextComponent.call(this, color, x, y, "0.0 secs", font);
    this.startTime = new Date().getTime();
};

ClockComponent.prototype = Object.create(TextComponent.prototype);
ClockComponent.prototype.constructor = ClockComponent;

/**
* @description Resets the timer to "0.0 seconds"
*/
ClockComponent.prototype.reset = function() {
    this.text = "0.0 seconds";
    this.startTime = new Date().getTime();
};

/**
* @description Updates the timer to the elapsed time
*/
ClockComponent.prototype.update = function() {
    this.elapsedTime = new Date().getTime() - this.startTime;
    this.text = ((this.elapsedTime/1000).toFixed(1) + " seconds") ;
};

/**
* @constructor Represents a menu bar to draw on the canvas
* @param {color} color - the color used to draw the score
* @param {x} x - The x coordinate of the component
* @param {y} y - The y coordinate of the component
* @param {number} - The number of bars comprising the menu bar
*/
let MenuBarComponent = function(color, x, y, bars) {
    ClickableComponent.call(this, color, x, y, 40, 27);
    this.bars = bars;
    this.space = 6;
};

MenuBarComponent.prototype = Object.create(ClickableComponent.prototype);
MenuBarComponent.prototype.constructor = MenuBarComponent;

/**
* @description Draws the menu bar on the canvas
* @param {object} ctx - The canvas rendering context object
*/
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
};

/**
* @description Click handler for the menu bar that stops the Engine and displays the player options
* @param {event} e - The event object
*/
MenuBarComponent.prototype.clickHandler = function(e) {
    if (!this.isMyEvent(e))
        return;
    Engine.stopEngine("INTERRUPT");
    $(' .game-options ').removeClass( 'hide' ).addClass( 'show' );
    $(' canvas ').removeClass( 'show' ).addClass( 'hide' );
};

/**
* @constructor Represents a restart button to draw on the canvas
* @param {string} color - The color used to draw the restart button
* @param {x} x - The x coordinate of the component
* @param {y} y - The y coordinate of the component
* @param {number} radius - The radius of the restart button
*/
let RestartComponent = function(color, x, y, radius) {
    ClickableComponent.call(this, color, x, y, radius * 2, radius * 2);
    this.radius = radius;
};

RestartComponent.prototype = Object.create(ClickableComponent.prototype);
RestartComponent.prototype.constructor = RestartComponent;

/**
* @description Draws a restart button on the canvas
* @param {object} ctx - The canvas rendering context object
*/
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
    ctx.moveTo(x + radius * 0.65, y);
    ctx.lineTo(x + 1.35 * radius, y);
    ctx.lineTo(x + radius, y + radius/2);
    ctx.lineTo(x + radius * 0.65, y);
    ctx.closePath();
    ctx.fill();
};

/**
* @description Click handler for the restart button restarts the game
* @param {event} e - An event object
*/
RestartComponent.prototype.clickHandler = function(e) {
    if (!this.isMyEvent(e)) return;
    game.reset();
};

/**
* @constructor Represents an image to draw on the canvas
* @param {string} image - The image to draw on canvas
* @param {x} x - The x coordinate of the component
* @param {y} y - The y coordinate of the component
*/
let ImageComponent = function(image, x, y) {
    Component.call(this, x, y);
    this.image = image;
};

ImageComponent.prototype = Object.create(Component.prototype);
ImageComponent.prototype.constructor = ImageComponent;

/**
* @description Draws the image on the canvas
* @param {object} ctx - The canvas rendering context object
*/
ImageComponent.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

/**
* @constructor Represents a game piece
* @param {string} image - The image to draw on the canvas
* @param {integer} row - The row on board where the image is drawn
* @param {integer} col - The column on board where the image is drawn
*/
let  GamePiece = function(image, row=0, col=0) {
    this.imageComponent = new ImageComponent(image, col * CELL_WIDTH, row * CELL_HEIGHT);
    this.row = row;
    this.col = col;
};

/**
* @description Returns the current location of the game piece in an object with properties row, col
*/
GamePiece.prototype.getCell = function() {
    return {
        row: this.row,
        col: this.col,
    };
};

/**
* @description Returns a random integer between min (inclusive) and max (inclusive)
*  stackoverflow 1527803
* @param {integer} min - minimum integer to return
* @param {integer} max - maximum integer to return
*/
GamePiece.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
* @description Draws the game piece on the canvas
* @param {object} ctx - The canvas rendering context object
*/
GamePiece.prototype.render = function(ctx) {
    this.imageComponent.render(ctx);
};

/**
* @constructor Represents the game board
*/
let Board = function() {
    this.board = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
        this.board[row] = [];
        for (let col = 0; col < COLS; col++) {
                this.board[row][col] = 0;
        }
    }
};

/**
* @description Resets the board to the initial state
*/
Board.prototype.reset = function() {
        for (let row = 0; row < ENEMY_ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                this.board[row][col] = 0;
        }
    }
};

/**
* @description Assigns a prize to a random board location and returns the assigned location in an
*   object with properties row, col
* @param {Prize} prize - The prize to assign to the board location
*/
Board.prototype.assignUnoccupiedCell = function(prize) {
    let done = false;
    let row, col;
    while (!done) {
        row = GamePiece.prototype.getRandomInt(1, ENEMY_ROWS);
        col = GamePiece.prototype.getRandomInt(0, COLS - 1);
        if (this.board[row -1 ][col] === 0) {
            done = true;
            this.board[row - 1][col] = prize;
        }
    }
    return {row, col};
};

/**
* @description Returns whatever occupies the given cell's location
* @param {Object {row: row, col: col}} cell - the cell
*/
Board.prototype.getCellOccupant = function(cell) {
    return (this.board[cell.row - 1][cell.col]);
};

/**
* @description Removes occupant from specified row, col
* @param {integer} row - the row
* @param {integer} col - the column
*/
Board.prototype.remove = function(row, col) {
    this.board[row - 1][col] = 0;
};

/**
* @constructor Represents a prize
* @param {string} img - image for prize
* @param {integer} points - points assigned to the prize
* @param {integer} width - width in pixels of prize image
*/
let Prize = function(image, points, width) {
    let cell = this.board.assignUnoccupiedCell(this);
    GamePiece.call(this, image, cell.row, cell.col);
    this.points = points;
    this.width = width;
    this.imageComponent.y += Prize.prototype.OFFSET_Y;
    this.imageComponent.x += ((CELL_WIDTH - width) * 0.5);
 };

Prize.prototype = Object.create(GamePiece.prototype);
Prize.prototype.constructor = Prize;
Prize.prototype.OFFSET_Y = 50;
Prize.prototype.board = new Board();

/**
* @description assigns new random location to prize
*/
Prize.prototype.reset = function() {
    // if prize has been captured and removed from renderables, put back in
    let renderables = game.getRenderables();
    if (renderables.indexOf(this) === -1)
        renderables.push(this);
    let cell = this.board.assignUnoccupiedCell(this);
    this.row = cell.row;
    this.col = cell.col;
    this.imageComponent.x = this.col * CELL_WIDTH;
    this.imageComponent.y = this.row * CELL_HEIGHT;
    this.imageComponent.y += Prize.prototype.OFFSET_Y;
    this.imageComponent.x += ((CELL_WIDTH - this.width) * 0.5);
};

/**
* @description Removes this prize from the game board
*/
Prize.prototype.removeFromBoard = function() {
    this.board.remove(this.row, this.col);
};

/**
* @constructor Represents an enemy
*/
let Enemy = function() {
   GamePiece.call(this,
        'images/enemy-bug.png',
        // if there are more than three enemies, assign extra enemy to random row
        Enemy.prototype.enemyCnt <= ENEMY_ROWS? Enemy.prototype.enemyCnt: Enemy.prototype.getRandomRow());
    this.imageComponent.x += this.getRandomXOffset();
    this.imageComponent.y -= Enemy.prototype.OFFSET_Y;
    this.rate = this.getRandomRate();
    this.id = Enemy.prototype.enemyCnt++;
};

Enemy.prototype = Object.create(GamePiece.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.enemyCnt = 1;
Enemy.prototype.OFFSET_Y = 20;

/**
* @description Resets enemy x position to a random negative number and resets enemy travel rate
* to a random rate
*/
Enemy.prototype.reset = function() {
        this.imageComponent.x = this.getRandomXOffset();
        this.rate = this.getRandomRate();
};

/**
* @description Returns a random row between 1 and 3
*/
Enemy.prototype.getRandomRow = function() {
    return GamePiece.prototype.getRandomInt(1, ENEMY_ROWS);
};

/**
* @description Returns a random y position
*/
Enemy.prototype.getNewY = function(row) {
    return row * CELL_HEIGHT - Enemy.prototype.OFFSET_Y;
};

/**
* @description Returns the cell the enemy currently occupies in an
*   object with properties row, col
*/
Enemy.prototype.getCell = function() {
    return {
        row: this.row,
        col: Math.round(this.imageComponent.x/CELL_WIDTH)};
};

/**
* @description Returns a negative random offset between 0 and 1000 inclusive
*/
Enemy.prototype.getRandomXOffset = function() {
    return -(this.getRandomInt(0, 1000));
};

/**
* @description Returns a random rate
*/
Enemy.prototype.getRandomRate = function() {
    return 50 + this.getRandomInt(0, 300);
};

/**
* @description - Updates the enemy position
* @param {number} dt - Time difference between ticks
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.imageComponent.x += (this.rate * dt);
    // if enemy is now off canvas
    if (this.imageComponent.x > CANVAS_WIDTH) {
        this.imageComponent.x = this.getRandomXOffset();
        // if enemy id is > 3, assign this enemy to new random row
        if (this.id > ENEMY_ROWS) {
            this.row = this.getRandomRow();
            // get new y position based on new random row
            this.imageComponent.y = this.getNewY(this.row);
        }
        // get new rate of speed
        this.rate = this.getRandomRate();
    }
};

/**
* @constructor Represents a player
*/
let Player = function(spriteImg) {
    this.points = 0;
    GamePiece.call(this, spriteImg, 5, 2);
    this.id = this.getID();
    this.imageComponent.x = CELL_WIDTH * 2;
    this.imageComponent.y += Player.prototype.OFFSET_Y;
    this.playerJQ = $( '.players-li' ).has( `img[src*='${spriteImg}']` );
    this.playerImgJQ = this.playerJQ.children('img');
    this.textAreaJQ = this.playerJQ.children('textarea');
    this.textAreaJQ.attr('readonly','readonly');
    // these handlers are used on the player overlay
    this.playerJQ.click(this.getClickHandler(this));
    this.playerJQ.hover(this.getHoverHandlerIn(this), this.getHoverHandlerOut(this));
    this.statsString = '';
};

Player.prototype = Object.create(GamePiece.prototype);
Player.prototype.constructor = Player;
Player.prototype.OFFSET_Y = -18; //-23

/**
* @description - Returns the game stats for the last game in object with properties
* time, points, gameEnd
*/
Player.prototype.getLastStats = function() {
    return this.stats;
};

/**
* @description - Stores last game stats for player and adds text to the player info html
*/
Player.prototype.addStats = function(gameEndParam) {
    let time = game.clockComponent.text;
    let points = game.scoreComponent.points;
    this.points += points;
    let gameEnd = gameEndParam;
    this.stats =
        {
            time: time,
            points: points,
            gameEnd: gameEnd,
        };
    this.statsString = `${gameEnd}   ${time}  ${points} points\n` + this.statsString;
    this.textAreaJQ.val("TOTAL POINTS: " + this.points + "\n\n" + this.statsString);
};

/**
* @description Returns an integer based on the current count of players
*/
Player.prototype.getID = function() {
    let cnt = 0;
    return function() {
        return cnt++;
    };
};

/**
* @description Resets the player to initial position
*/
Player.prototype.reset = function() {
    this.row = 5;
    this.col = 2;
    this.imageComponent.x = this.col * CELL_WIDTH;
    this.imageComponent.y = this.row * CELL_HEIGHT;
    this.imageComponent.x = CELL_WIDTH * 2;
    this.imageComponent.y += Player.prototype.OFFSET_Y;
};

/**
* @description Draws this player on the canvas
* @param: {object} ctx - The canvas rendering context object
*/
Player.prototype.render = function(ctx) {
    this.imageComponent.render(ctx);
};

/**
* @description Adds player-selected style to player img and textarea html elements
*/
Player.prototype.deselect = function() {
    this.playerImgJQ.removeClass('player-selected');
    this.textAreaJQ.removeClass('player-selected');
};

/**
* @description Removes player-selected style from player img and textarea html elements
*/
Player.prototype.select = function() {
    this.playerImgJQ.addClass('player-selected');
    this.textAreaJQ.addClass('player-selected');
};

/**
* @description Returns hover handler for player, handler adds class 'player-img-hover' to
*   player img and textarea elements on cursor entry if the player is not the current player
* @param {Player} player - Player object
*/
Player.prototype.getHoverHandlerIn = function(player) {
    return function() {
        if (game.player === player)
            return;
        player.playerImgJQ.addClass('player-img-hover');
        player.textAreaJQ.addClass('player-img-hover');
    };
};

/**
* @description Returns hover handler for player, handler removes class 'player-img-hover' from
*   player img and textarea elements on cursor exit
* @param {Player} player - Player object
*/
Player.prototype.getHoverHandlerOut = function(player) {
    return function() {
        player.playerImgJQ.removeClass('player-img-hover');
        player.textAreaJQ.removeClass('player-img-hover');
    };
};

/**
* @description Handles arrow key input for moving player on board
*/
Player.prototype.move = function(key) {
    switch(key) {
        case 'left':
            if (this.col > 0) {
                this.imageComponent.x -= CELL_WIDTH;
                this.col--;
            }
            break;
        case 'up':
            if (this.row > 0) {
                this.imageComponent.y -= CELL_HEIGHT;
                this.row--;
                if (this.row === 0) {
                    Engine.stopEngine("WIN");
                }
            }
            break;
        case 'right':
            if (this.col < 4) {
                this.imageComponent.x += CELL_WIDTH;
                this.col++;
            }
            break;
        case 'down':
            if (this.row < 5) {
                this.imageComponent.y += CELL_HEIGHT;
                this.row++;
            }
            break;
    }
};

/**
* @description Returns click handler function for player; function sets the current game player
*  to this player
*/
Player.prototype.getClickHandler = function(player) {
    return function() {
        game.setPlayer(player);
    };
};

/**
* @constructor Represents the game
* @param {object} global - global scope object
*/
let Game = function(global) {

    function getCloseIconClickHandler(canvasJQ, gameOptionsJQ) {
        return function() {
            gameOptionsJQ.removeClass( 'show' ).addClass( 'hide' );
            canvasJQ.removeClass( 'hide' ).addClass( 'show' );
            Engine.init();
        };
    }

    function attachCloseIconClickHandler(closeIconJQ, canvasJQ, gameOptionsJQ) {
        closeIconJQ.click(getCloseIconClickHandler(canvasJQ, gameOptionsJQ));
    }

    /**
    * @description creates game players and returns an array of players
    */
    function createPlayers() {
        let players = [];
        for (let i = 0; i < PLAYER_IMAGES.length; i++) {
            players.push(new Player(PLAYER_IMAGES[i]));
        }
        return players;
    }

    /**
    * @description creates game enemies and returns an array of enemies
    */
    function createEnemies(enemyCnt) {
        let enemies = [];
        for (let i = 0; i < enemyCnt; i++) {
               enemies.push(new Enemy());
        }
        return enemies;
    }

    /**
    * @description creates game prizes and returns an array of prizes
    */
    function createPrizes() {
        let prizes = [];
        prizes.push(new Prize('images/Gem Green.png', 10, 80));
        prizes.push(new Prize('images/Gem Blue.png',10, 78));
        prizes.push(new Prize('images/Gem Orange.png', 10, 77));
        prizes.push(new Prize('images/Heart.png',  10, 82));
        prizes.push(new Prize('images/Key.png',  10, 49));
        prizes.push(new Prize('images/Rock.png',  -10, 77));
        prizes.push(new Prize('images/Star.png', 10, 88));
        return prizes;
    }

    /**
    * @description creates game canvas and adds event listeners for menu and restart
    */
    function createCanvas() {
        let doc = global.document;
        canvas = doc.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        doc.body.appendChild(canvas);

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

    /**
    * @description attach button handler to play again button
    */
    function attachButtonHandler() {
        $( '.buttn' ).click(function() {
            game.gameOverOverlayJQ.removeClass( 'transparent' ).addClass( 'hide' );
            game.canvasJQ.removeClass( 'no-access' ).addClass( 'show' );
            game.reset();
        });
    }

    this.renderables = [];
    this.updateables = [];
    this.prizes = [];
    this.gameOverOverlayJQ = $(' .game-over-overlay ');
    this.gameOverMessageJQ = $(' .game-over-message ');
    this.winDataJQ = $(' .win-data ');
    this.restartComponent = new RestartComponent("#1ebb1e", 5, 16, 13);
    this.renderables.push(this.restartComponent);
    this.menuBarComponent = new MenuBarComponent("#1ebb1e", CANVAS_WIDTH - 45, 20, 3);
    this.renderables.push(this.menuBarComponent);
    this.titleComponent = new TextComponent("#1ebb1e", CANVAS_WIDTH/2, 40, "Bug Speedway",
        "30px Comic Sans ms");
    this.renderables.push(this.titleComponent);
    this.clockComponent = new ClockComponent("#ccc", CELL_WIDTH, 40, "15px Comic Sans ms");
    this.renderables.push(this.clockComponent);
    this.updateables.push(this.clockComponent);
    this.players = createPlayers();
    this.player = this.players[0];
    this.renderables.push(this.player);
    this.enemies = createEnemies(5);
    this.prizes = createPrizes();
    this.renderables = this.renderables.concat(this.prizes);
    this.scoreComponent = new ScoreComponent("#ccc", CANVAS_WIDTH - CELL_WIDTH, 40, "15px Comic Sans ms");
    this.renderables.push(this.scoreComponent);
    this.canvas = createCanvas();
    this.canvasJQ = $( 'canvas' );
    attachCloseIconClickHandler($( '.close-x' ), this.canvasJQ, $( '.game-options' ));
    attachButtonHandler();

    document.addEventListener( 'keyup' , function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        game.player.move(allowedKeys[e.keyCode]);
    });
};

/**
* @description Returns game renderables
*/
Game.prototype.getRenderables = function() {
    return this.renderables;
};

/**
* @description Returns game updateables
*/
Game.prototype.getUpdateables = function() {
    return this.updateables;
};

/**
* @description Returns canvas
*/
Game.prototype.getCanvas = function() {
    return this.canvas;
};

/**
* @description Sets the current game player
* @param {Player} player - New player
*/
Game.prototype.setPlayer = function(player) {
    // ignore if player clicked is already current player
    if (player === this.player)
        return;
    this.player.deselect();
    let index = this.renderables.indexOf(this.player);
    this.renderables.splice(index, 1);
    this.player = player;
    this.player.select();
    this.renderables.push(this.player);
    this.reset();
};

/**
* @description Returns the array of enemies
*/
Game.prototype.getEnemies = function() {
    return this.enemies;
};

/**
* @description Displays game won overlay with game stats
* @param {string} endType - "WIN" or "LOSS"
*/
Game.prototype.processGameEnd = function(endType) {
    this.player.addStats(endType);
    let stats = this.player.getLastStats();

    this.winDataJQ.text(`Game ${endType === "WIN"? "won" : "lost"}
    in ${stats.time}, ${endType === "WIN" ? stats.points : 0} points`);
    this.gameOverMessageJQ.text(endType === "WIN" ? "Congratulations! You won!":
        "Oh no!  You were squashed like a bug.");
    this.canvasJQ.removeClass('show').addClass('no-access');
    this.gameOverOverlayJQ.removeClass('hide').addClass('transparent');
};

/**
* @description Sets up a new game
*/
Game.prototype.reset = function() {
    // reset player
    this.player.reset();
    // reset prizes
    Prize.prototype.board.reset();
    for (let i = 0; i < this.prizes.length; i++)
        this.prizes[i].reset();
    // reset clock
    this.clockComponent.reset();
    // reset score
    this.scoreComponent.reset();
    // reset enemies
    for (let i = 0; i < this.enemies.length; i++)
        this.enemies[i].reset();
    Engine.init();
};

/**
* @description Returns the current player
*/
Game.prototype.getPlayer = function() {
    return this.player;
};

/**
* @description Removes captured prize from board and updates player score
*/
Game.prototype.processCapturedPrize = function(prize) {
    let index = this.renderables.indexOf(prize);
    this.renderables.splice(index, 1);
    prize.removeFromBoard();
    this.scoreComponent.update(prize.points);
};


