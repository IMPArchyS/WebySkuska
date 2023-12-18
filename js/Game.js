var characterX = 0; // Initial character position
var characterY = 0; // Initial y position
var characterYVelocity = 0; // Initial vertical velocity
var onGround = true; // Is the cube on the ground?
var gravity = 0.5; // Gravity
var jumpForce = -15; // Jump force

const KEY_A = 65;
const KEY_D = 68;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    background(200);
    windowResized(); // Ensure correct canvas size at start
    characterX = width / 2 - 25; // Middle of the screen horizontally
    characterY = height - 50; // Bottom of the screen vertically
}

function draw() {
    background(200);
    drawCharacter(); // Draw the character at its current position
    handleUserInput(); // Handle user input to move the character
}

function drawCharacter() {
    // Draw the character as a simple rectangle
    fill(255, 0, 0); // Red color
    rect(characterX, characterY, 50, 50); // Character position and size
    // Apply gravity
    characterYVelocity += gravity;

    // Apply vertical velocity to y position
    characterY += characterYVelocity;

    // Check if the cube is on the ground
    if (characterY > height - 50) {
        characterY = height - 50;
        characterYVelocity = 0;
        onGround = true;
    }
}

function handleUserInput() {
    if (keyIsDown(KEY_A)) { 
        characterX -= 5; 
        if (characterX + 50 < 0) { // If the character is completely off the left side of the screen
            characterX = width; // Move it to the right side
        }
    } else if (keyIsDown(KEY_D)) { 
        characterX += 5; 
        if (characterX > width) { // If the character is completely off the right side of the screen
            characterX = -50; // Move it to the left side
        }
    }
    if (onGround) { 
        characterYVelocity = jumpForce;
        onGround = false;
    }
}

function windowResized() {
    var containerWidth = select('#canvas-container').width;
    resizeCanvas(containerWidth, windowHeight);
    background(200);
}