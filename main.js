// set canvas 
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let img = document.getElementById('snakeimg');

    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 105, 70, 120, 150);


let x = localStorage.getItem('highscore');
let highscore = document.getElementById('highscore').innerHTML = x || 0


function startGame() {
//score
let score = 0;

//speed
let speed = 200;

//create canvas
function clearCanvas() {
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

//create snake and direction
let snake = [
    {x: 150, y:150}, 
    {x:140, y:150}, 
    {x:130, y:150}, 
    {x: 120, y: 150},  
    {x: 110, y: 150},
]



function drawSnakePart(snakePart) {
    let snakeBody = document.getElementById('body').value;
    let snakeBorder = document.getElementById('border').value;

    function change(e){
        snakeBody = this.value;
        snakeBorder = this.value;
    }

    snakeBody.onChange = change;
    snakeBorder.onChange = change;

    ctx.fillStyle = snakeBody;
    ctx.strokeStyle = snakeBorder;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);    
}

let dx = 10;
let dy = 0;

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;

    if(keyPressed === LEFT_KEY && !goingRight){
        dx = -10;
        dy = 0;
    } else if(keyPressed === RIGHT_KEY && !goingLeft){
        dx = 10;
        dy = 0
    } else if(keyPressed === UP_KEY && !goingDown){
        dx = 0;
        dy = -10;
    } else if(keyPressed === DOWN_KEY && !goingUp){
        dx = 0;
        dy = 10;
    } 

}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

//create food
function randomTen(min, max) {
    return (Math.round(Math.random() * (max/10)) * 10);
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height -10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if(foodIsOnSnake) {
            createFood();
        }
    })
}

function drawFood() {
    ctx.fillStyle = 'red'; 
    ctx.strokeStyle = 'darkRed'; 
    ctx.fillRect (foodX, foodY, 10, 10);
    ctx.strokeRect (foodX, foodY, 10, 10);
}

//move snake and change snake when eaten food
function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if(didEatFood){
        score += 10;
        speed -= 5;
        if(speed === 50){
            speed -= 0;
        }
        document.getElementById('score').innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }

    for(let i = 4; i < snake.length; i++){
        if(snake[0].x > gameCanvas.width - 10){
            snake[0].x = 0;
        } else if(snake[0].x < 0){
            snake[0].x = gameCanvas.width - 10;
        } else if(snake[0].y > gameCanvas.height - 10){
            snake[0].y = 0;
        } else if(snake[0].y < 0){
            snake[0].y = gameCanvas.height - 10
        }
    }
}

createFood();

//check if game ended
function didGameEnd() {
    for(let i = 4; i < snake.length; i++){
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if(didCollide){
            return true;
        }
    }
}


//keep on moving snake
function main() {
    if(didGameEnd()){
        clearCanvas();
        ctx.drawImage(img, 105, 70, 120, 150);
        ctx.font = '50px Arial';
        ctx.fillStyle  ='black';
        ctx.fillText('Game Over', 25, 155)
        if(highscore < score){
            document.getElementById('highscore').innerHTML = score;
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
        return
    };

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, speed
)};



//listen for key press
document.addEventListener("keydown", changeDirection);


main();

}
