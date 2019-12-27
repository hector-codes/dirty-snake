/**
 * @Author http://github.com/hector-codes
 * @License GPLv3
 */
const canvas = document.getElementById('canvas');
canvas.width = 1600;
canvas.height = 900;
canvas.style.backgroundColor = '#222222';

const {width:maxWidth, height:maxHeight} = canvas;
/** @type {CanvasRenderingContext2D} */
const c = canvas.getContext('2d');

let score = 0;

const config = {
    cellSize: 20,
    cellColor: '#03A696',
    fps: 8,
    screenOffset: 100,
    snakeSpeed: 10,
};

const helpers = {
    randomInt: function(min, max) {
        return Math.floor( min + Math.random() * (max - min + 1) );
    },
    randomX : function() {
        return helpers.round(helpers.randomInt(config.screenOffset, maxWidth - config.screenOffset));
    },
    randomY: function() {
        return helpers.round(helpers.randomInt(config.screenOffset, maxHeight - config.screenOffset));
    },
    round: function( num ) {
        return config.cellSize * Math.ceil( num / config.cellSize );
    }
};

const snake = {
    size: 3,
    color: '#03A696',
    headColor: '#038C7F',
    speed: config.cellSize,
    direction: 'right',
    cells: [],
}

const controls = function(e) {

    switch (e.key) {
        case 'ArrowUp':
            if ('down' !== snake.direction && ( Math.abs(snake.cells[0].y - snake.cells[1].y) !== config.cellSize)) {
                snake.direction = 'up';
            }
            break;
        case 'ArrowRight':
            if ('left' !== snake.direction && ( Math.abs(snake.cells[0].x - snake.cells[1].x) !== config.cellSize)) {
                snake.direction = 'right';
            }
            break;
        case 'ArrowDown':
            if ('up' !== snake.direction && ( Math.abs(snake.cells[0].y - snake.cells[1].y) !== config.cellSize)) {
                snake.direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if ('right' !== snake.direction && ( Math.abs(snake.cells[0].x - snake.cells[1].x) !== config.cellSize)) {
                snake.direction = 'left';
            }
            break;
        default:
            break;
    }
}

document.addEventListener('swiped-left', function(e) {
    if ('right' !== snake.direction && ( Math.abs(snake.cells[0].x - snake.cells[1].x) !== config.cellSize)) {
        snake.direction = 'left';
    }
});

document.addEventListener('swiped-right', function(e) {
    if ('left' !== snake.direction && ( Math.abs(snake.cells[0].x - snake.cells[1].x) !== config.cellSize)) {
        snake.direction = 'right';
    }
});

document.addEventListener('swiped-up', function(e) {
    if ('down' !== snake.direction && ( Math.abs(snake.cells[0].y - snake.cells[1].y) !== config.cellSize)) {
        snake.direction = 'up';
    }
});

document.addEventListener('swiped-down', function(e) {
    if ('up' !== snake.direction && ( Math.abs(snake.cells[0].y - snake.cells[1].y) !== config.cellSize)) {
        snake.direction = 'down';
    }
});

window.addEventListener( 'keydown', controls );

let food = {
    x: undefined,
    y: undefined,
    c: '#F2505D',
    e: false,
};

const foodExists = function() {
    return food.e;
}

const addFood = function() {
    if ( foodExists() ) return;

    food.x = helpers.randomX();
    food.y = helpers.randomY();
    food.e = true;
}

const showFood = function() {
    c.beginPath();
    c.fillStyle = food.c;
    c.fillRect(food.x, food.y, config.cellSize, config.cellSize);
}

const initSnake = function() {
    let x = helpers.randomX();
    let y = helpers.randomY();
    
    snake.cells.push(generateCell( x + config.cellSize,y, snake.headColor ));

    for (let i = 0; i < snake.size - 1; i++) {
        snake.cells.push( generateCell(x - i * config.cellSize, y) );
    }
}

const generateCell = function( x, y, color = snake.color ) {
    return {
        x: x,
        y: y,
        c: color,
    }
}

const eatFood = function() {
    food.e = false;
    let x = helpers.round(snake.cells[snake.cells.length - 1].x);
    let y = helpers.round(snake.cells[snake.cells.length-1].y);
    snake.cells.push(generateCell(x, y));
    score += 10;
}

const showSnake = function() {
    c.beginPath();
    for (let i = 0; i < snake.cells.length; i++) {
        c.fillStyle = snake.cells[i].c;
        c.fillRect( snake.cells[i].x, snake.cells[i].y, config.cellSize, config.cellSize );
    }
}

const showScore = function () {
    c.beginPath();
    c.font = '16px monospace'
    c.fillText(score, 50, 50);
}

const init = function() {
    initSnake();
    addFood();
    showSnake();
    showFood();
    showScore();
}

let playTimeout;

const play = function() {
    let headCell = snake.cells[0];

    for (let i = snake.cells.length - 1; i > 0 ; i--) {
        snake.cells[i].x = snake.cells[i-1].x;
        snake.cells[i].y = snake.cells[i-1].y;
    }

    switch (snake.direction) {
        case 'up':
                snake.cells[0].y -= snake.speed;
            break;
        case 'right':
                snake.cells[0].x += snake.speed;
            break;
        case 'down':
                snake.cells[0].y += snake.speed;
            break;
        case 'left':
                snake.cells[0].x -= snake.speed;
            break;
    
        default:
            break;
    }

    if ( Math.abs(headCell.x - food.x) < config.cellSize &&  Math.abs(headCell.y - food.y) < config.cellSize ) {
        eatFood();
        config.fps += 0.5;
        addFood();
    }

    for (let i = 0; i < snake.cells.length; i++) {
        console.log(snake.cells.length);
        console.log( i + ': ' + Math.abs(snake.cells[i].x - food.x) + '-' +  Math.abs(snake.cells[i].y - food.y))
        if ( Math.abs(snake.cells[i].x - food.x) < config.cellSize &&  Math.abs(snake.cells[i].y - food.y) < config.cellSize ) {
            food.e = false;
            addFood();
            break;
        }
    }

    if ( headCell.x > maxWidth - config.cellSize || headCell.y > maxHeight - config.cellSize || headCell.x < 0 || headCell.y < 0 ) {
        clearTimeout(playTimeout);
        return;
    }

    for (let i = 1; i < snake.cells.length; i++) {
        if ( Math.abs(headCell.x - snake.cells[i].x) < config.cellSize &&  Math.abs(headCell.y - snake.cells[i].y) < config.cellSize ) {
            clearTimeout(playTimeout)
            return;
        }
    }

    playTimeout = setTimeout(play, 1000/config.fps);
    c.clearRect( 0, 0, maxWidth, maxHeight );
    showSnake();
    showFood();
    showScore();
}

init();
play();