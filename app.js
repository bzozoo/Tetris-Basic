//Game Constanses amd important variables
const squaresEmpty = Array.from(document.querySelectorAll(".grid div"));
const miniSquaresEmpty = Array.from(document.querySelectorAll(".mini-grid div"));
const scoreDisplay = document.querySelector("#score");
let grid = document.querySelector(".grid");
let miniGrid = document.querySelector(".mini-grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
let miniSquares = Array.from(document.querySelectorAll(".mini-grid div"));
let firstSquareInRow = document.querySelectorAll(".first-in-row");
let startBtn = document.querySelector("#start-button");
const music = document.getElementById("myAudio"); 
const width = 10;

//show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 6;
const displayIndex = 1;
//////

//InitGame Options
let newStart = true;
let startState = false;
let muteState = false;
let nextRandom = 0;
let timerId;
let score = 0;
let currentPosition = 4;
let currentRotation = 0;
let musicInterval;
////

//The Tetrominoes
     /* lTetronimo is the example *
                 0 1 2    0 1 2    0 1 2    0 1 2
                |--------------------------------    
            0   |  X               X X          X
        width   |  X      X X X      X      X X X
    2 * width   |  X X    X          X          
    */
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1]
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3]
];

  const liTetromino = [
    [0, 1, width+1, width*2+1],
    [2, width, width+1, width+2],
    [0, width, width*2, width*2+1],
    [0,1,2,width]
  ];

  const ziTetromino = [
    [1,width,width+1,width*2],
    [0,1,width+1, width + 2],
    [1,width,width+1,width*2],
    [0,1,width+1, width + 2]
  ];

//Tetromino pair with colors arrays
const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, liTetromino, ziTetromino];
const colors = ["orange", "red", "purple", "green", "blue", "brown", "turquoise"];

//randomly select a Tetromino and its first rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

//the Tetrominos without rotations
const upNextTetrominoes = [
  [2 * displayWidth + 1, 2 * displayWidth + 2, 3 * displayWidth + 1, 4 * displayWidth + 1], //lTetromino
  [2 * displayWidth + 1, 3 * displayWidth + 1, 3 * displayWidth + 2, 4 * displayWidth + 2], //zTetromino
  [2 * displayWidth + 1, 3 * displayWidth,  3 * displayWidth + 1,  3 * displayWidth + 2], //tTetromino
  [2 * displayWidth + 1, 2 * displayWidth + 2, 3 * displayWidth + 1, 3 * displayWidth + 2], //oTetromino
  [1 * displayWidth + 1, 2 * displayWidth + 1, 3 * displayWidth + 1, 4 * displayWidth + 1], //iTetromino
  [2 * displayWidth + 1, 2 * displayWidth + 2, 3 * displayWidth + 2, 4 * displayWidth + 2], // liTetromino
  [2 * displayWidth + 2, 3 * displayWidth + 1, 3 * displayWidth + 2, 4 * displayWidth + 1] // ziTetromino
];
////////////////////////////////////////////////////////////////


/// FUNCTIONS SECTION

function initGame() {
  console.log("Init Game");
  scoreInit();
  squaresInit();
  clearInterval(timerId);
  timerId = null;
  nextRandom = 0;
  newStart = true;
  currentPosition = 4;
  currentRotation = 0;
  random = Math.floor(Math.random() * theTetrominoes.length);
  current = theTetrominoes[random][currentRotation];
  activateGameButtons()
  startState = false;
  startBtn.innerHTML = '▶ START';
  deactivateGameButtons()
}

function scoreInit() {
  console.log("Score Init");
  score = 0;
  scoreDisplay.innerHTML = score;
}

function squaresInit() {
  console.log("Squares Init");
  squares.forEach(function (square, sqkey) {
    if (sqkey < 230) {
      squares[sqkey].style = "";
      squares[sqkey].classList.remove("taken");
      squares[sqkey].classList.remove("tetromino");
    }
  });
  
  miniSquares.forEach(function (miniSquare, sqkey) {
      miniSquares[sqkey].style = "";
      miniSquares[sqkey].classList.remove("tetromino");
   });
}

//draw the Tetromino
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

//undraw the Tetromino
function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}



//move the tetromino left, unless is at the edge or there is a blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

//move the tetromino right, unless is at the edge or there is a blockage
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition += 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  //console.log(currentPosition)
  draw();  
  freeze();
}

//freeze function
function freeze() {
  if(current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach((index) => squares[currentPosition + index].classList.add("taken"));
 
    //start a new tetromino falling   
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;

    addScore();
    gameOver();
    
    draw();
    displayShape();
  }
}

///FIX ROTATION OF TETROMINOS A THE EDGE
function isAtRight() {
  return current.some((index) => (currentPosition + index + 1) % width === 0);
}

function isAtLeft() {
  return current.some((index) => (currentPosition + index) % width === 0);
}

function checkRotatedPosition(P) {
  P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
  if ((P + 1) % width < 4) {
    //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
    if (isAtRight()) {
      //use actual position to check if it's flipped over to right side
      currentPosition += 1; //if so, add one to wrap it back around
      checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
    }
  } else if (P % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
    }
  }
}

//rotate the tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    //if the current rotation gets to 4, make it go back to 0
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  checkRotatedPosition();
  draw();
}
/////////  

//display the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetromino form the entire grid
  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
  upNextTetrominoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("tetromino");
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

//Remove full lines and add score(s)
function addScore() {
  for (let i = 0; i < 229; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        
    if (row.every((index) => squares[index].classList.contains("taken"))) {
      
      console.log("REMOVED SQUARES i :" + i)
      
      score += 10;
      scoreDisplay.innerHTML = score;

      //Remove Classes and color from removed SQUARES
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      });

      //Remove Full Squares
      const squaresRemoved = squares.splice(i, width);
      
      //Remove hidden SQUARES from Line0-Line1
      const hiddenSquaresRemoved = squares.splice(0, width * 2);
      
      //Re-add to SQUARES the removed SQUARES 
      squares = squaresRemoved.concat(squares);
      squares = hiddenSquaresRemoved.concat(squares);
      
      //Render new Squares
      squares.forEach((cell, key) => createNewGridLine(cell, key));
    }
  }
}

function createNewGridLine(cell, key) {
  console.log(cell, key)
  grid.appendChild(cell);
}

//game over
function gameOver() {
  if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
    scoreDisplay.innerHTML = "end";
    clearInterval(timerId);

    document.removeEventListener("keyup", control);
    deactivateGameButtons()
  }
}


function startpauseSwitcher(){
  if(startState === false){
    startState = true;
    console.log("STARTED")
  } else {
    startState = false;
    console.log("PAUSED")
  }
  startpauseButtonSwitcher()
}

function startpauseButtonSwitcher(){
  if(startState === false){
    startBtn.innerHTML = '▶ START';
  } else {
    startBtn.innerHTML = '	⏸ PAUSE';
  }
}

function muteSwitcher(){
  if(muteState === false){
    muteState = true;
    musicInterval = setInterval(playMusic, 1);
  } else {
    muteState = false;
    clearInterval(musicInterval);
    music.pause()
  }
  muteButtonSwitcher()
}

function muteButtonSwitcher(){
  if(muteState === false){
    muteButton.innerHTML = '🔇 MUTE';
  } else {
    muteButton.innerHTML = '🔈 MUTE';
  }
}

function playMusic(){
  music.play()
}

//add functionality to the START button
startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    newStart = false;
    startpauseSwitcher()
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    startpauseSwitcher()
    activateGameButtons()
        
    if (newStart === true) {
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
     
    }
  }
});

//add functionality to the START button
muteButton.addEventListener("click", () => {
  muteSwitcher()
});

//assign functions to keyCodes
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

function activateGameButtons(){
console.log("GAME BUTTONS ACTIVATED")
document.addEventListener("keyup", control);
leftMove.addEventListener("click", moveLeft);
rightMove.addEventListener("click", moveRight);
downMove.addEventListener("click", moveDown);
rotation.addEventListener("click", rotate);
resetButton.addEventListener("click", initGame);
}

function deactivateGameButtons(){
    console.log("GAME BUTTONS DEACTIVATED")
    document.removeEventListener("keyup", control);
    leftMove.removeEventListener("click", moveLeft);
    rightMove.removeEventListener("click", moveRight);
    downMove.removeEventListener("click", moveDown);
    rotation.removeEventListener("click", rotate);
    
}

/// FUNCTIONS SECTION ENDE
