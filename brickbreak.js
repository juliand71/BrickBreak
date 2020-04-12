// get the canvas object and context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// x and y positions of the ball
var x = canvas.width / 2;
var y = canvas.height - 30;

// direction of the ball
var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;

var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// initialize the 2 dimensional array of bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            // if we actually need to draw the bricks
            if (bricks[c][r].status == 1) {
                // calculate X and Y position for the brick
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            // get our current brick
            var b = bricks[c][r];
            // if our brick is still in play
            if (b.status == 1) {
                // if a collision is detected
                if (x > b.x && x < (b.x + brickWidth) && y > b.y && y < b.y + brickHeight) {
                    // change our y direction
                    dy = -dy
                    // change brick status to 0
                    b.status = 0;
                }
            }

        }
    }
}

function draw() {
    // clear the canvas so that objects drawn in previous frame are removed
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the objects in our canvas
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // if the ball hits the side walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // if the ball hits the top
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // if the ball is at the bottom of the page...
    else if (y + dy > canvas.height - ballRadius) {
        // bounce off the paddle if it hits it
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        // game over if it misses
        else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }

    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;
}


var interval = setInterval(draw, 10);