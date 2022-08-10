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
#######@##
#######.##
###F....##
###.###.##
#.......##
#.########
#..?######
##########
##########
`;

const levelThreeMap = `
##########
####..####
#?...#####
####.#####
####.#####
####.#####
#...F#####
#..#######
#.......@#
##########
`;

const levelFourMap = `
##########
#........#
#........#
#....?...#
#........#
#........#
#........#
#........#
#.......@#
##########
`;

const levelFiveMap = `
##########
#........#
#........#
#....?...#
#........#
#........#
#........#
#........#
#.......@#
##########
`;

const levelSixMap = `
##########
#........#
#........#
#....@...#
#........#
#........#
#..?.....#
#........#
#........#
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
        player.cell = cell;
      }
      if (item === "?") {
        egg.cell = cell;
      }
    }
  }
  start() {
    this.drawMap();
    this.fox.patrol();
    levelCount.textContent = this.name;
  }
  stop() {
    if (this.fox) {
      this.fox.stop();
    }
  }
}

const game = {
  isStarted: false,
  isGameOver: false,
  level: 0,

  startGame() {
    startTime();
    moveToGameScreen();
    levels[this.level].start();
    player.show();
    egg.show();
    this.isStarted = true;
  },
  clearBoard() {
    for (const cell of board.gridArray) {
      cell.classList.remove(`levelWalls`);
    }
  },
  levelUp() {
    this.clearBoard();
    levels[this.level].fox.stop();
    this.level += 1;
    player.hide();
    egg.hide();
    levels[this.level].start();
    player.show();
    egg.show();
  },
};

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
    for (let i = 0; i < this.height * this.width; i++) {
      const cell = document.createElement(`div`);
      cell.classList.add(`gridSquare`);
      cell.dataset.index = i;
      this.gridArray.push(cell);
      this.gameScreen.append(cell);
    }
  }
}

const board = new GameBoard(10, 10);

class Fox {
  constructor(path, cell) {
    this.intervalId = null;
    this.className = "fox";
    this.cell = cell;
    this.path = path;
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
      console.log("running");
      if (counter === this.path.length) {
        counter = 0;
      }
    }, 200);
  }
  move(index) {
    this.cell = board.gridArray[index];
  }
  stop() {
    clearInterval(this.intervalId);
    console.log(`test`);
    this.hide();
  }
  eatChicken() {}
}

const player = {
  className: `player`,
  lives: 3,
  cell: null,

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
    }
  },
  detectWallCollision(cell) {
    if (cell.classList.contains(`levelWalls`)) {
      return true;
    }
  },
};

const egg = {
  className: `egg`,
  cell: null,
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

const levels = [
  new Level(
    "Farm Escape",
    levelOneMap,
    new Fox(
      [
        74, 75, 76, 66, 56, 46, 36, 35, 34, 33, 34, 35, 36, 46, 56, 66, 76, 75,
        74, 73,
      ],
      board.gridArray[73]
    )
  ),
  new Level(
    "Harvest Day",
    levelTwoMap,
    new Fox(
      [57, 57, 47, 37, 36, 35, 34, 33, 43, 53, 54, 55, 56],
      board.gridArray[56]
    )
  ),
  new Level(
    "3",
    levelThreeMap,
    new Fox(
      [64, 54, 44, 34, 24, 14, 15, 14, 24, 34, 44, 54, 64, 63],
      board.gridArray[63]
    )
  ),
  new Level(
    "4",
    levelFourMap,
    new Fox([66, 56, 46, 36, 46, 56, 66, 76], board.gridArray[36])
  ),
  new Level(
    "5",
    levelFiveMap,
    new Fox([66, 56, 46, 36, 46, 56, 66, 76], board.gridArray[36])
  ),
  new Level(
    "Fox Den",
    levelSixMap,
    new Fox([66, 56, 46, 36, 46, 56, 66, 76], board.gridArray[36])
  ),
];
