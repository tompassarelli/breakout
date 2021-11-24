var aStart = new Audio('start.wav');
var aBounce = new Audio('ball-hit.wav');
var aDestroy = new Audio('destroy.wav');

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var CANVAS_WIDTH = canvas.width = 480
var CANVAS_HEIGHT = canvas.height = 320

pause = false;

const ballBaseDx = 2
const ballBaseDy = 3
var ballX = CANVAS_WIDTH / 2;
var ballY = CANVAS_HEIGHT - 50;
var ballR = 10;
var ballDx = ballBaseDx
var ballDy = -ballBaseDy;

function handleSpeedIncrease(brick) {
		ballDy = (~ballDy +1)
		switch (brick.level) {
			case (2):
					if (ballDy <= ballBaseDy) { 
						ballDy*=1.2
					}
				break;
			case (1):
					if (ballDy <= ballBaseDy*1.2) { 
						ballDy*=1.4
					}
				break;
			case (0):
					if (ballDy <= ballBaseDy*1.4) { 
						ballDy*=1.7
					}
				break;
			default:
		}
}

var playerX = CANVAS_WIDTH / 2 - 40;
var playerY = CANVAS_HEIGHT - 30;
var playerW = 80;
var playerH = 10;
var rightPressed = false
var leftPressed = false

let brickCount = 0;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = []
var test = false;
if (test == true) {
	briwRowCount =1
	brickColumnCount =1
}

function generateBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, color: randomColor(), level:r};
			brickCount ++;
		}
	}
}
generateBricks()


function drawBricks() {

	for (let c = 0; c < bricks.length; c++) {
		for (let r = 0; r < bricks[c].length; r++) {
			let bX = bricks[c][r].x = (c * (brickWidth + brickPadding)) + brickOffsetLeft
			let bY = bricks[c][r].y = (r * (brickHeight + brickPadding)) + brickOffsetTop
			ctx.beginPath();
			ctx.fillStyle = bricks[c][r].color
			ctx.fillRect(bX, bY, brickWidth, brickHeight)
			ctx.closePath()
		}

	}
}

function draw() {
	if (pause) {
		return;
	}
	handleCollision()
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	handleKeys()
	drawBackground()
	drawBricks()
	drawPlayer()
	drawBall()
}

aStart.play()
var intervalID = setInterval(draw, 10);

function drawBackground() {
	ctx.fillStyle = '#212121'
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function drawPlayer() {
	ctx.fillStyle = 'cornflowerblue';
	ctx.fillRect(playerX, playerY, playerW, playerH)
}
function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI)
	ctx.fillStyle = 'gray';
	ctx.fill()
	ctx.closePath();
	ballX += ballDx
	ballY += ballDy
}


function handleCollision() {
	//player hit
	if ((ballY + ballR >= playerY-1)
		&& ballY + ballR <= playerY + playerH+1) {
		if ((ballX >= playerX-5) && ballX <= (playerX + playerW+5)) {
			ballDy = ~ballDy + 1
			ballY-= 1;
			aBounce.play();
		}
	}
	//bricks
	for (let c=0; c < bricks.length; c++)	 {
		for (let r=0; r < bricks[c].length; r++) {
			let brickArea = bricks[c][r].x + brickWidth
			if (ballY-ballR <= bricks[c][r].y) {
				if (ballX <= brickArea && ballX > bricks[c][r].x) {
					handleSpeedIncrease(bricks[c][r])
					bricks[c].splice(r, 1)
					brickCount --;
					aDestroy.play();
				}
			}
		}
	}
	//walls
	if (ballX + ballR > CANVAS_WIDTH || ballX - ballR < 0) {
		ballDx = ~ballDx + 1
	}
	if (ballY - ballR < 0) {
		ballDy = ~ballDy + 1
	}
	if (ballY - ballR > CANVAS_HEIGHT) {
		alert('Gameover \nPress OK or Enter to Restart')
		document.location.reload()
	}
	if (brickCount == 0) {
		alert('Gameover...You Win!')
		document.location.reload()
	}

}
function handleKeys() {
	if (rightPressed && playerX < CANVAS_WIDTH) {
		playerX += 7
	}
	if (leftPressed && playerX > 0) {
		playerX -= 7
	}
}

function randomColor() {
	function rng() {
		return (50 + Math.random() * 205)
	}
	return 'rgb(' + rng() + ',' + rng() + ',' + rng() + ')'
}

document.addEventListener('keydown', (e) => {
	if (e.key == 'ArrowLeft' || e.key == 's') {
		leftPressed = true
	}
	if (e.key == 'ArrowRight' || e.key == 'f') {
		rightPressed = true
	}
	if (e.key == '`') {
		if (!pause) {
			pause = true;
		} else {
			pause = false
		}
	}

})

document.addEventListener('keyup', (e) => {
	if (e.key == 'ArrowLeft' || e.key == 's') {
		leftPressed = false
	}
	if (e.key == 'ArrowRight' || e.key == 'f') {
		rightPressed = false
	}
})

function process_touch(e) {
if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    playerX = parseInt(touch.pageX) - CANVAS_WIDTH;
} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    playerX = parseInt(e.clientX) - CANVAS_WIDTH
	}
}

canvas.addEventListener('touchstart', process_touch, false);
canvas.addEventListener('touchmove', process_touch, false);
canvas.addEventListener('touchcancel', process_touch, false);
canvas.addEventListener('touchend', process_touch, false);
