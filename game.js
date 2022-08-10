const startButton = document.getElementById(`start`);
const restartButton = document.getElementById(`restart`);

const startScreen = document.getElementById("startPage");
const gameScreen = document.getElementById(`gameScreen`);
const scoreScreen = document.getElementById(`scoreScreen`);

let clock = document.querySelector(`.clock`);
const levelCount = document.querySelector(`h2`);

// function setTimer() {

//   time = setInterval(function () {
//     time ++;
//   }, 400)}

// setTimer()

let timeLeft = 15;
let timerId;
function startTime() {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setInterval(countdown, 1000);
}
function countdown() {
  if (timeLeft === -1) {
    clearTimeout(timerId);
  } else {
    clock.textContent = "HATCHING IN " + timeLeft + "!";
    timeLeft--;
  }
}

const levelOneMap = `
##########
#?.......#
########.#
#......#.#
#.####F#.#
#.###.P#.#
#.####P#.#
#.#PPPP#.#
#@####...#
##########
`;

const levelTwoMap = `
##########
#?.......#
########.#
#......#.#
#.####F#.#
#.###.P#.#
#.####P#.#
#.#PPPP#.#
#@####...#
##########
`;

class Level {
  constructor(name, map, fox) {
    this.name = name;
    this.map = map;
    this.fox = fox;
  }
  drawMap() {
    const mapItems = this.map.split("\n").join("").split("");
    for (let i = 0; i < mapItems.length; i++) {
      const item = mapItems[i];
      const cell = board.gridArray[i];

      if (item === "#") {
        cell.classList.add(`levelWalls`);
      }
      if (item === "@") {
        console.log("SETTING PLAYER CELL", cell);
        player.cell = cell;
      }
      if (item === "?") {
        egg.cell = cell;
      }
    }
  }
  startLevel() {
    this.drawMap();
    this.fox.patrol();
    levelCount.textContent = this.name;
  }
}

// const levelOneArray = [
//   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30,
//   37, 39, 40, 42, 43, 44, 45, 47, 49, 50, 52, 53, 54, 55, 57, 59, 60, 62, 63,
//   64, 65, 67, 69, 70, 72, 77, 79, 80, 82, 83, 84, 85, 89, 90, 91, 92, 93, 94,
//   95, 96, 97, 98, 99,
// ];
// const levelTwoArray = [10, 11, 12, 13, 14, 15, 16, 17, 18];
// const levelThreeArray = [10, 11, 12, 13, 14, 15, 16, 17, 18];
// const levelFourArray = [10, 11, 12, 13, 14, 15, 16, 17, 18];
// const levelFiveArray = [10, 11, 12, 13, 14, 15, 16, 17, 18];
// const levelSixArray = [10, 11, 12, 13, 14, 15, 16, 17, 18];
// const arrayOfLevels = [
//   levelOneArray,
//   levelTwoArray,
//   levelThreeArray,
//   levelFourArray,
//   levelFiveArray,
//   levelSixArray,
// ];

const game = {
  isStarted: false,
  isGameOver: false,
  level: 0,

  startGame() {
    moveToGameScreen();
    levels[this.level].startLevel();
    player.show();
    egg.show();
    this.isStarted = true;
  },
  // displayWalls() {},
  // displayWallsOld() {
  //   const currentLevel = arrayOfLevels.at(this.level - 1);
  //   for (let i = 0; i < currentLevel.length; i++) {
  //     board.gridArray[currentLevel[i]].classList.add(`levelWalls`);
  //   }
  // },
  clearBoard() {
    for (const cell of board.gridArray) {
      cell.classList.remove(`levelWalls`);
    }
  },
  levelUp() {
    this.clearBoard();
    this.level += 1;

    player.hide();
    egg.hide();
    levels[this.level].startLevel();
    player.show();
    egg.show();
    // spawnFox();
    // timeLeft = 15
    // startTime()
    // countdown()
  },
};

startButton.addEventListener("click", startTime);
startButton.addEventListener("click", () => game.startGame());
restartButton.addEventListener(`click`, restartGame);

function restartGame() {
  game.isStarted = false;
  game.level = 1;
  game.startGame();
  game.displayWalls();
}

class GameBoard {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.gameScreen = gameScreen;
    this.gridArray = [];
    this.cells = this.buildGameBoard();
  }

  buildGameBoard() {
    //builds square gameboard based on width/height arguments
    for (let i = 0; i < this.height * this.width; i++) {
      const cell = document.createElement(`div`);
      cell.classList.add(`gridSquare`);
      cell.dataset.index = i;
      this.gridArray.push(cell);
      this.gameScreen.append(cell);
    }
  }
}

let fox;
const board = new GameBoard(10, 10);

class Fox {
  constructor(path, cell) {
    this.intervalId = null;
    this.className = "fox";
    this.cell = cell || spawnFoxBasedOnLevel(game.level);
    this.path = path || setFoxPath();
    // this.show();
    // this.patrol();
  }
  show() {
    this.cell.classList.add(this.className);
  }
  hide() {
    this.cell.classList.remove(this.className);
  }
  patrol() {
    let counter = 0;
    this.intervalId = setInterval(() => {
      this.hide();
      this.move(this.path[counter++]);
      this.show();
      if (counter === this.path.length) {
        counter = 0;
      }
    }, 200);
  }
  move(index) {
    this.cell = board.gridArray[index];
  }
  eatChicken() {}
  clear() {
    clearInterval(this.intervalId);
  }
}

// function spawnFox() {
//   if (fox) {
//     fox.clear();
//     fox.cell.classList.remove("fox");
//   }
//   fox = new Fox();
// }

// function setFoxPath() {
//   const path = [];
//   switch (game.level) {
//     case 1:
//       path.push(74, 75, 76, 66, 56, 46, 36, 46, 56, 66, 76, 75, 74, 73);
//       break;
//     case 2:
//       path.push();
//       break;
//     case 3:
//       path.push();
//       break;
//     case 4:
//       path.push();
//       break;
//     case 5:
//       path.push();
//       break;
//     case 6:
//       path.push();
//       break;
//   }
//   return path;
// }

const player = {
  className: `player`,
  lives: 3,
  cell: null, //spawnPlayerBasedOnLevel(game.level),

  show() {
    this.cell.classList.add(this.className);
  },
  hide() {
    this.cell.classList.remove(this.className);
  },
  move(direction) {
    if (!this.canMove(direction)) {
      return;
    }

    this.hide();
    const currentIndex = parseInt(this.cell.dataset.index);
    let newIndex;

    switch (direction) {
      case "up":
        newIndex = currentIndex - board.width;
        break;
      case "down":
        newIndex = currentIndex + board.width;
        break;
      case "right":
        newIndex = currentIndex + 1;
        break;
      case "left":
        newIndex = currentIndex - 1;
        break;
    }
    this.cell = board.gridArray[newIndex];
    if (this.detectWallCollision(this.cell)) {
      this.cell = board.gridArray[currentIndex];
    }
    this.show();
    this.detectEggCollision();
  },
  canMove(direction) {
    const currentIndex = parseInt(this.cell.dataset.index);
    const column = currentIndex % board.width;
    switch (direction) {
      case "up":
        return currentIndex >= board.width;
      case "down":
        const boardSize = board.width * board.height;
        return currentIndex < boardSize - board.width;
      case "right":
        return column < board.width - 1;
      case "left":
        return column > 0;
    }
  },
  detectEggCollision() {
    if (this.cell.dataset.index === egg.cell.dataset.index) {
      console.log(`collected`);
      game.levelUp();
      this.respawn();
    }
  },
  detectWallCollision(cell) {
    if (cell.classList.contains(`levelWalls`)) {
      return true;
    }
  },
  respawn() {
    this.hide();
    // this.cell = spawnPlayerBasedOnLevel(game.level);
    this.show();
  },
};

const egg = {
  className: `egg`,
  cell: null, // spawnEggBasedOnLevel(game.level),
  show() {
    this.cell.classList.add(this.className);
  },
  hide() {
    this.cell.classList.remove(this.className);
  },
};

function moveToGameScreen() {
  startScreen.classList.toggle(`hidden`);
  gameScreen.classList.toggle(`hidden`);
}

function moveToScoreScreen() {
  gameScreen.classList.toggle(`hidden`);
  scoreScreen.classList.toggle(`hidden`);
}

function returnToStartScreen() {
  startScreen.classList.toggle(`hidden`);
  scoreScreen.classList.toggle(`hidden`);
}

// function spawnPlayerBasedOnLevel(level) {
//   switch (level) {
//     case 1:
//       return board.gridArray[81];
//     case 2:
//       return board.gridArray[50];
//     case 3:
//       return board.gridArray[60];
//     case 4:
//       return board.gridArray[99];
//     case 5:
//       return board.gridArray[7];
//     case 6:
//       return board.gridArray[45];
//   }
// }

// function spawnEggBasedOnLevel(level) {
//   switch (level) {
//     case 1:
//       return board.gridArray[11];
//       break;
//     case 2:
//       return board.gridArray[75];
//       break;
//     case 3:
//       return board.gridArray[4];
//       break;
//     case 4:
//       return board.gridArray[85];
//       break;
//     case 5:
//       return board.gridArray[39];
//       break;
//     case 6:
//       return board.gridArray[21];
//       break;
//   }
// }

// function spawnFoxBasedOnLevel(level) {
//   switch (level) {
//     case 1:
//       return board.gridArray[73];
//       break;
//     case 2:
//       return board.gridArray[23];
//       break;
//     case 3:
//       return board.gridArray[40];
//       break;
//     case 4:
//       return board.gridArray[0];
//       break;
//     case 5:
//       return board.gridArray[99];
//       break;
//     case 6:
//       return board.gridArray[64];
//       break;
//   }
// }

document.addEventListener("keydown", (event) => {
  if (!game.isStarted) {
    return;
  }

  switch (event.code) {
    case "ArrowUp":
      player.move("up");
      break;
    case "ArrowDown":
      player.move("down");
      break;
    case "ArrowLeft":
      player.move("left");
      break;
    case "ArrowRight":
      player.move("right");
      break;
  }
});

// class Wolf extends Fox {
//   constructor(){

//   }
// }

// class Worm {
//   constructor(points) {
//     this.points = points
//   }

// }

const levels = [
  new Level(
    "Farm Escape",
    levelOneMap,
    new Fox(
      [74, 75, 76, 66, 56, 46, 36, 46, 56, 66, 76, 75, 74, 73],
      board.gridArray[36]
    )
  ),
  new Level(
    "Fox Den",
    levelTwoMap,
    new Fox([66, 56, 46, 36, 46, 56, 66, 76], board.gridArray[36])
  ),
];
