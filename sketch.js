/*
Name: Shayan
Date: March 31st, 2022
Description: Volcano Scene
*/

let clicked = false;
let e;
let sx, sy;
let wave, plane;
let skyColour;

function setup() {
  createCanvas(750, 600);

  // Create an object of the Eruption Class
  e = new Eruption();

  // Set the default position of the sun
  sx = 100;
  sy = -100 * sin((1 / 170) * sx - 0.6) + 200;

  // Load the wave image
  wave = loadImage("wave.png");
  // Load the plane image
  plane = loadImage("plane.png");
  
  skyColour = (158, 255, 247);
}

function draw() {
  background(skyColour);

  // Move the sun with left and right key
  if (keyIsDown(LEFT_ARROW)) {
    sx -= 5;
  } else if (keyIsDown(RIGHT_ARROW)) {
    sx += 5;
  }

  // Set the y position of the sun with a sine function
  sy = -100 * sin((1 / 170) * sx - 0.6) + 200;

  // Check to see sun is not out of the canvas and set it back insdie
  if (sx - 20 < 0) {
    sx = 20;
  } else if (sx + 20 > width) {
    sx = width - 20;
  }

  // Call functions
  drawSun(sx, sy);
  drawOcean();
  drawIsland();
  drawVolcano();
  drawBoat((frameCount % (width + 200)) - 100, 500); // Make the boat keep moving and reappearing on the screen
  drawPlane((frameCount % (width + 200)) - 100, 50);

  // Call the erupt method to move and draw the lava particles when mouse is clicked
  if (clicked) {
    e.erupt();
  }
}

// When mouse is pressed set the clicked variable to true
function mousePressed() {
  clicked = true;
}

// Draw the sun
function drawSun(x, y) {
  // Colour it yellow
  fill(252, 244, 3);
  circle(x, y, 40);
  
  // Set the colour of the sky depending on the position of the sun
  skyColour = color(180/sy*100-60, 500/sy*50-90, 500/sy*50-90);
  
}

// Draw the volcano with a custom shape
function drawVolcano() {
  // Colour the volcano brown
  fill(99, 58, 1);
  strokeWeight(3);
  beginShape();
  vertex(470, 340);
  vertex(430, 270);
  vertex(330, 270);
  vertex(290, 340);
  vertex(200, 420);
  vertex(250, 410);
  vertex(255, 420);
  vertex(300, 410);
  vertex(325, 420);
  vertex(360, 410);
  vertex(410, 420);
  vertex(430, 413);
  vertex(460, 419);
  vertex(540, 410);
  vertex(470, 340);
  endShape();

  // Make the top part orange
  fill(250, 120, 0);
  ellipse(380, 270, 100, 15);

  // Add a little bit of red on the top
  fill(255, 0, 0);
  ellipse(380, 275, 100, 5);
}

// Draw the island with two rectangles and give it the colour green
function drawIsland() {
  fill(0, 175, 0);
  strokeWeight(0);
  rect(180, 365, 390, 90, 40);
  rect(270, 380, 170, 100, 40);
}

// Draw the ocean with an ellipse and give it the colour blue
function drawOcean() {
  fill(0, 0, 255);
  strokeWeight(0);
  ellipse(width / 2, height, 2000, 520);
}

// Draw the boat and waves
function drawBoat(x, y) {
  // Colour the boat white
  fill(255);

  // Place the boat on the screen
  rect(x + 10, y + 20, 30, 10);
  quad(x, y + 30, x + 70, y + 30, x + 45, y + 50, x + 25, y + 50);

  // Place the wave images on screen
  image(wave, x - 80, y + 20, 50, 25);
  image(wave, x - 100, y + 52, 50, 25);
  image(wave, x - 150, y, 50, 25);
}

// Draw the plane image
function drawPlane(x, y) {
  translate(width, 0);
  scale(-1, 1);
  image(plane, x, y, 100, 100);
}

class Eruption {
  constructor() {
    this.lava = [];
    this.numOfLava = random(90, 120); // Set a random number of lava particles to appear
    this.cnt = 0;

    // Initialize the lava balls
    for (let i = 0; i < this.numOfLava; i++) {
      this.lava[i] = new Lava(
        random(330, 430), // Random 'x' position at the top of the volcano
        270, // Height of the volcano
        random(-2.5, 2.5), // Random 'x' speed
        random(2, 6), // Random 'y' speed
        random(1, 10) // Random lava size
      );
    }
  }

  // Make the lava move out of the volcano
  erupt() {
    for (let i = 0; i < this.numOfLava; i++) {
      // If the lava is on the screen move it and display it
      if (this.lava[i].isOnScreen()) {
        this.lava[i].move();
        this.lava[i].display();
      }
      // Otherwise count how many lava balls have left the screen
      else {
        this.cnt++;
      }

      // Once all the balls have left the screen
      if (this.cnt == round(this.numOfLava)) {
        // Set clicked to false and make a new object so volcano can erupt again
        e = new Eruption();
        clicked = false;
      }
    }
    // Reset back to 0
    this.cnt = 0;
  }
}

class Lava {
  constructor(x, y, dx, dy, diameter) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.diameter = diameter;
  }

  // Checks if the lava ball is on the screen
  isOnScreen() {
    // If ball has exited the screen from the left or right side
    if (this.x > width || this.x < 0) {
      return false;
    }
    // If ball has exited the screen from the top or bottom
    if (this.y > height || this.y < 0) {
      return false;
    }
    // Otherwise ball is still on screen
    return true;
  }

  // Displays the lava ball
  display() {
    // Make them red with a bit of orange tint
    fill(255, 50, 0);
    ellipse(this.x, this.y, this.diameter, 10);
  }

  // Moves the lava ball
  move() {
    this.x += this.dx;
    this.y -= this.dy;
    // Deccelerate particles (make the particles fall)
    this.dy -= 0.04;
  }
}
