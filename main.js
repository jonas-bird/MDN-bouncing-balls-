// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// get the score counter
const scoreCounter = document.querySelector('p');

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}
// keep track of the number of balls visible
let numberBalls = 0;
// define a shape class for the balls and the player controlled evilCircle to inherit from
class Shape {

  constructor (x, y, velX, velY) {

    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    }
}

// class to represent the colored balls that bounce around
class Ball extends Shape {

  exists;

  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
    numberBalls += 1;
    // update score counter
    scoreCounter.textContent = `Ball count: ${numberBalls}`;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

     if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
   }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists === true){
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }

}

// player controlled EvilCircle that swallows up the bouncing balls
class EvilCircle extends Shape {

  constructor(x, y){
    super(x,y,20,20);
    this.color = "rgb(255,255,255)";
    this.size = 10;

    // add in the eventListener that enables the player to control the "EvilCircle"
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });
  }
  // method to display the "EvilCircle" on the canvas, based on the similar
  // method for Ball class
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

 // prevents the "EvilCircle" from going off the edge of the screen
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = this.x - this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x = this.x + this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y = this.y - this.size;
    }

     if ((this.y - this.size) <= 0) {
       this.y = this.y + this.size;
   }

  }
  // method that controls what happens when the player controled "EvilCircle"
  // encounters one of the balls
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists === true){
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          numberBalls -= 1;
          scoreCounter.textContent = `Ball count: ${numberBalls}`;
        }
      }
    }
  }



 }



// array to contain the balls
const balls = [];

while (balls.length < 25) {
  const size = random(10,20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
}
// create the player controlled "EvilCircle"
const player1 = new EvilCircle(10, 10);

// main animation loop that redraws the screen and updates the position of the balls
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if(ball.exists === true){
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }}
  // update the players position and check for the edge of the screen and collisions
  player1.draw();
  player1.checkBounds();
  player1.collisionDetect();
  requestAnimationFrame(loop);
}


loop(); // starts the animation loop
