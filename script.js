const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load kitty face image
const kittyFace = new Image();
kittyFace.src = "images/kitty-face.png"; // Replace with the correct path to your image

// Load mouse images
const mouseImages = [
  "images/mouse-red.png",
  "images/mouse-green.png",
  "images/mouse-blue.png",
  "images/mouse-yellow.png",
];

const mouseImagesArray = mouseImages.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

const paddleWidth = 100; // Adjusted width
const paddleHeight = 15; // Adjusted height
const ballRadius = 15; // Adjusted radius
const mouseWidth = 80; // Adjusted width for mouse images
const mouseHeight = 30; // Adjusted height for mouse images
let x = canvas.width / 2;
let y = canvas.height - 40;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let level = 1;
let lives = 3;

const brickRowCount = 3;
const brickColumnCount = 7; // Increased number of columns
const brickPadding = 15; // Increased padding
const brickOffsetTop = 70; // Adjusted offset
const brickOffsetLeft = 40; // Adjusted offset

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
      image:
        mouseImagesArray[Math.floor(Math.random() * mouseImagesArray.length)],
    };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.getElementById("reset").addEventListener("click", resetGame);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          x > brick.x &&
          x < brick.x + mouseWidth &&
          y > brick.y &&
          y < brick.y + mouseHeight
        ) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("Congratulations! You win!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  if (kittyFace.complete) {
    ctx.drawImage(
      kittyFace,
      x - ballRadius,
      y - ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
  } else {
    kittyFace.onload = () => {
      ctx.drawImage(
        kittyFace,
        x - ballRadius,
        y - ballRadius,
        ballRadius * 2,
        ballRadius * 2
      );
    };
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000"; // This makes the paddle black
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (mouseWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (mouseHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.drawImage(
          bricks[c][r].image,
          brickX,
          brickY,
          mouseWidth,
          mouseHeight
        );
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial"; // Increased font size
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawLevel() {
  ctx.font = "20px Arial"; // Increased font size
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: " + level, canvas.width - 110, 30);
}

function drawLives() {
  ctx.font = "20px Arial"; // Increased font size
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 110, 60);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLevel();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 40;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  x = canvas.width / 2;
  y = canvas.height - 40;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        image:
          mouseImagesArray[Math.floor(Math.random() * mouseImagesArray.length)],
      };
    }
  }
  draw();
}

// Start the game after all images are loaded
Promise.all(
  mouseImagesArray.map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  )
).then(() => {
  draw();
});
