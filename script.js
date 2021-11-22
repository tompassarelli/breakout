var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var CANVAS_WIDTH = canvas.width = 480
var CANVAS_HEIGHT = canvas.height = 320

var ballX = CANVAS_WIDTH/2;
var ballY = CANVAS_HEIGHT-50;
var ballR = 12;
var ballDx= 3;
var ballDy = -3;

var playerX = CANVAS_WIDTH/2-40;
var playerY = CANVAS_HEIGHT-30;
var rightPressed = false
var leftPressed = false

function draw() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	handleKeys()
	drawBackground()
	drawPlayer()
	drawBall()
	handleCollision()
	ballX += ballDx
	ballY += ballDy
}

var intervalID = setInterval(draw, 8);

function drawBackground() {
	ctx.fillStyle = '#212121'
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}

function drawPlayer() {
	ctx.fillStyle = 'cornflowerblue';
	ctx.fillRect(playerX,playerY, 80, 10)
}
function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballR, 0, 2*Math.PI)
	ctx.fillStyle = 'gray';
	ctx.fill()
	ctx.closePath();
}

// function drawDestructable() {
// 	ctx.fillStyle = 'cornflowerblue';
// 	ctx.fillRect(playerX-40,playerY, 80, 10)
// }

function handleCollision() {

	if (ballY+ballR >= playerY) {
		if ((ballX-ballR >= playerX-10) && ballX+ballR <= playerX+90) {
			ballDx = ~ballDx + 1
			ballX += 1.5*ballDx
			ballDy = ~ballDy + 1
			ballY += 1.5*ballDy
		}
	}
	//walls
	if (ballX+ballR > CANVAS_WIDTH || ballX-ballR < 0 ) {
		ballDx = ~ballDx + 1
	}
	if (ballY-ballR < 0) {
		ballDy = ~ballDy + 1
	} 
	if (ballY-ballR > CANVAS_HEIGHT) {
		alert('Gameover \nPress OK or Enter to Restart')
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
document.addEventListener('keydown', (e) => {
	if (e.key =='ArrowLeft' || e.key == 's') {
		leftPressed = true
	}
	if (e.key == 'ArrowRight' || e.key == 'f') {
		rightPressed = true
	}
})

document.addEventListener('keyup', (e) => {
	if (e.key =='ArrowLeft' || e.key == 's') {
		leftPressed = false
	}
	if (e.key == 'ArrowRight' || e.key == 'f') {
		rightPressed = false
	}
})
