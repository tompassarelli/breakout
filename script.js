let aStart = new Audio('start.wav');
let aBounce = new Audio('ball-hit.wav');
let aDestroy = new Audio('destroy.wav');

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let CANVAS_WIDTH = canvas.width = window.innerWidth
let CANVAS_HEIGHT = canvas.height = window.innerHeight

let pause = false;

let speedLevel = 0;
const ballBaseDx = 3
const ballBaseDy = 5
let ballX = CANVAS_WIDTH / 2 - 40;
let ballY = CANVAS_HEIGHT - 50;
let ballR = 10;
let ballDx = ballBaseDx
let ballDy = -ballBaseDy;

const playerSpeedModifierVal = .5;
let playerSpeedModifier = false;
let playerSpeed = 12

let brickCount = 0;
let brickRowCount = 4;
let brickColumnCount = 8;
let brickPadding = 5;
let brickOffsetTop = 150;
let brickOffsetLeft = Math.max(CANVAS_WIDTH * .025, 20);
let brickWidth = (CANVAS_WIDTH - (2 * brickOffsetLeft) - (brickPadding * brickColumnCount)) / (brickColumnCount);
let brickHeight = CANVAS_HEIGHT * .05;
let bricks = []

let playerWidth = Math.max(CANVAS_WIDTH * .10, 80)
let playerHeight = CANVAS_HEIGHT * .0225;
let playerX = CANVAS_WIDTH / 2;
let playerY = CANVAS_HEIGHT - playerHeight * 2;
let rightPressed = false
let leftPressed = false

let wallDebounce = 0
let brickDebounce = 0

let test = false;
if (test == true) {
	briwRowCount = 1
	brickColumnCount = 1
}

function generateBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, color: randomColor(), level: r };
			bricks[c][r].x = (c * (brickWidth + brickPadding)) + brickOffsetLeft
			bricks[c][r].y = (r * (brickHeight + brickPadding)) + brickOffsetTop
			brickCount++;
		}
	}
}
generateBricks()

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
let intervalID = setInterval(draw, 10);

function drawBricks() {

	for (let c = 0; c < bricks.length; c++) {
		for (let r = 0; r < bricks[c].length; r++) {
			ctx.beginPath();
			ctx.fillStyle = bricks[c][r].color
			ctx.fillRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight)
			ctx.closePath()
		}

	}
}

function handleBrickHit(brick) {
	switch (true) {
		case ((brick.level == 4) && (ballDy <= ballBaseDy)):
			if (ballDy > 0) {
					ballDy = (~ballBaseDy+1) * 1.15
				} else {
					ballDy = ballBaseDy * 1.15
				}
				ballDx = Math.min(ballDx, 3.5)
				speedLevel = 1.15;
			break;
		case ((brick.level == 3) && (ballDy <= ballBaseDy)):
			if (ballDy > 0) {
					ballDy = (~ballBaseDy+1) * 1.3
				} else {
					ballDy = ballBaseDy * 1.3
				}
				ballDx = Math.min(ballDx, 4)
				speedLevel = 1.3;
			break;
		case ((brick.level == 2) && (ballDy <= ballBaseDy)):
			if (ballDy > 0) {
					ballDy = (~ballBaseDy+1) * 1.45
				} else {
					ballDy = ballBaseDy * 1.45
				}
				ballDx = Math.min(ballDx, 4.25)
				speedLevel = 1.45;
			break;
		case ((brick.level == 1) && (ballDy <= ballBaseDy)):
				if (ballDy > 0) {
					ballDy = (~ballBaseDy+1) * 1.575
				} else {
					ballDy = ballBaseDy * 1.575
				}
				ballDx = Math.min(ballDx, 4.5)
				speedLevel = 1.57;
			break;
		case ((brick.level == 0) && (ballDy <= ballBaseDy)):
				if (ballDy > 0) {
					ballDy = (~ballBaseDy+1) * 1.65
				} else {
					ballDy = ballBaseDy * 1.65
				}
				ballDx = Math.min(ballDx, 5)
				speedLevel = 1.65;
			break;
		default:
			ballDy = (~ballDy+1)
			break;
	}
}
function handleBallAngleAdjustment(x, type) {
	let spot = 0;
	if (type == "brick") {
		spot = (ballX - x) / brickWidth
	} else {
		spot = (ballX - x) / playerWidth
	}
	switch (true) {
		case (spot < 0.20):
			ballDx = (ballBaseDx + (ballBaseDx * speedLevel))
			if (ballDx > 0) {
				ballDx = ~ballDx + 1
			}
			break;
		case (spot > 0.80):
			ballDx = (ballBaseDx + (ballBaseDx * speedLevel));
			if (ballDx < 0) {
				ballDx = ~ballDx + 1
			}
			break;
		default:
			break;
	}
}

function drawBackground() {
	ctx.fillStyle = '#212121'
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function drawPlayer() {
	ctx.fillStyle = 'cornflowerblue';
	ctx.fillRect(playerX, playerY, playerWidth, playerHeight)
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
	if ((ballY + ballR >= playerY - 1)
		&& ballY + ballR <= playerY + playerHeight + 1) {
		if ((ballX >= playerX - 5) && ballX <= (playerX + playerWidth + 5)) {
			handleBallAngleAdjustment(playerX, "player")
			ballDy = ~ballDy + 1
			ballY -= 1;
			aBounce.play();
		}
	}
	//bricks
		for (let c = 0; c < bricks.length; c++) {
			for (let r = 0; r < bricks[c].length; r++) {
				let brickEnd = bricks[c][r].x + brickWidth
				if (((ballY - ballR) >= bricks[c][r].y) && ((ballY - ballR) <= (bricks[c][r].y + brickHeight))) {
					if (ballX <= brickEnd && ballX > bricks[c][r].x) {
						handleBrickHit(bricks[c][r])
						bricks[c].splice(r,1)
						console.log(bricks)
						brickCount--;
						aDestroy.play();
					}
				}
			}
		}
	//walls
	if (wallDebounce == 0) {
		if (ballX + ballR >= CANVAS_WIDTH || ballX - ballR <= 0) {
			ballDx = ~ballDx + 1
			wallDebounce = 30;
		}
	} else if (wallDebounce > 0) {
		wallDebounce -= 10
	}

	if (ballY - ballR <= 0) {
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
	if (rightPressed && (playerX < CANVAS_WIDTH - playerWidth)) {
		if (playerSpeedModifier === false) {
			playerX += playerSpeed
		} else {
			playerX += playerSpeed * playerSpeedModifierVal
		}
	}
	if (leftPressed && (playerX > 0)) {
		if (playerSpeedModifier === false) {
			playerX -= playerSpeed
		} else {
			playerX -= playerSpeed * playerSpeedModifierVal
		}
	}
}

function randomColor() {
	function rng() {
		return (50 + Math.random() * 205)
	}
	return 'rgb(' + rng() + ',' + rng() + ',' + rng() + ')'
}

document.addEventListener('keydown', (e) => {
	if (e.key == 'Shift') {
		playerSpeedModifier = true
	}
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
	if (e.key == 'Shift') {
		playerSpeedModifier = false
	}
})

function process_touch(e) {
	if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		playerX = parseInt(touch.pageX)
	} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
		playerX = parseInt(e.clientX)
	}
}

canvas.addEventListener('touchstart', process_touch, false);
canvas.addEventListener('touchmove', process_touch, false);
canvas.addEventListener('touchcancel', process_touch, false);
canvas.addEventListener('touchend', process_touch, false);