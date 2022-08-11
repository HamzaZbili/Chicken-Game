const startButton = document.getElementById(`start`);
const restartButton = document.querySelectorAll(`.restart`);
const startScreen = document.getElementById("startPage");
const gameScreen = document.getElementById(`gameScreen`);
const gameOverScreen = document.getElementById(`gameOver`);
const winScreen = document.getElementById(`winScreen`);

const livesContainer = document.querySelector(`.lives`);

let clock = document.querySelector(`.clock`);
const levelCount = document.querySelector(`h3`);

function moveToGameScreen() {
  startScreen.classList.add(`hidden`);
  gameScreen.classList.remove(`hidden`);
  winScreen.classList.add(`hidden`);
  gameOverScreen.classList.add(`hidden`);
}

let timeLeft = 10;
let timerId;
function startTime() {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setInterval(countdown, 1000);
}

function countdown() {
  if (timeLeft === -1) {
    game.gameOver(game.timeOut);
  } else {
    clock.textContent = timeLeft + " time remaining!";
    timeLeft--;
  }
}

const levelOneMap = `
##########
#?.......#
########.#
#......#.#
#.####F#.#
#.###..#.#
#.####.#.#
#.#....#.#
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
#...@#####
#.########
#.......F#
######.#.#
########.#
########.#
########.#
########?#
##########
`;

const levelFiveMap = `
##########
##########
#####?####
#####.####
#####.####
##@##....#
##.##....#
##.##...F#
##....####
##########
`;

const levelSixMap = `
##########
#........#
#...?....#
#........#
####.#####
###F..####
####.#####
#........#
#......@.#
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
  level: 0,
  isGameOver: false,
  timeOut: `Time out`,
  caughtByFox: `Caught by Fox`,
  outOfLives: `Out of Lives`,
  lives: 2,
  livesArray: [],

  startGame() {
    this.clearBoard();
    startTime();
    moveToGameScreen();
    levels[this.level].start();
    player.show();
    egg.show();
    this.updateLives();
    this.isStarted = true;
  },
  clearBoard() {
    for (const cell of board.gridArray) {
      cell.classList.remove(`levelWalls`);
      cell.classList.remove(`player`);
      cell.classList.remove(`dirt`);
      cell.classList.remove(`fox`);
    }
  },
  levelUp() {
    timeLeft = 10;
    this.clearBoard();
    levels[this.level].fox.stop();
    this.level += 1;
    if (this.level === 6) {
      this.win();
      return;
    } else {
      player.hide();
      egg.hide();
      levels[this.level].start();
      player.show();
      egg.show();
    }
  },
  gameOver(death) {
    if (death === this.caughtByFox) {
      this.isGameOver = true;
      (this.isStarted = false), levels[this.level].fox.stop();
      clearInterval(timerId);
      gameScreen.classList.toggle(`hidden`);
      gameOverScreen.classList.toggle(`hidden`);
    } else if (death === this.timeOut && this.lives >= 0) {
      timeLeft = 10;
      // countdown();
      this.loseLife();
    } else {
      clearInterval(timerId);
      gameScreen.classList.toggle(`hidden`);
      gameOverScreen.classList.toggle(`hidden`);
      this.isGameOver = true;
    }
  },
  loseLife() {
    this.clearBoard();
    this.lives -= 1;
    levels[this.level].stop();
    levels[this.level].drawMap();
    levels[this.level].start();
    player.show();
    this.updateLives();
  },
  updateLives() {
    livesContainer.textContent = null;
    for (let i = 0; i < this.lives + 1; i++) {
      const life = document.createElement("div");
      life.classList.add("life");
      livesContainer.appendChild(life);
    }
  },
  restart() {
    this.clearBoard();
    this.isGameOver = true;
    egg.hide();
    player.hide();
    this.level = 0;
    levels[this.level].fox.stop();
    moveToGameScreen();
    timeLeft = 10;
    startTime();
    this.level = 0;
    this.lives = 2;
    levels[this.level].start();
    player.show();
    egg.show();
    this.updateLives();
    this.isStarted = true;
    //sorry Robin!
  },
  win() {
    clearInterval(timerId);
    gameScreen.classList.toggle(`hidden`);
    winScreen.classList.toggle(`hidden`);
  },
};

startButton.addEventListener("click", () => game.startGame());

restartButton.forEach((btn) =>
  btn.addEventListener("click", () => game.restart())
);

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
    this.show();
    this.intervalId = setInterval(() => {
      this.hide();
      this.move(this.path[counter++]);
      this.checkChickenCollision();
      this.show();
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
    this.hide();
  }
  checkChickenCollision() {
    if (this.cell.classList.contains(`player`)) {
      game.gameOver(game.caughtByFox);
      this.stop();
    }
  }
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
    this.detectFoxCollision();
  },
  canMove(direction) {
    if (this.cell.classList.contains(`dirt`)) {
      return false;
    }
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
  dig() {
    this.cell.classList.toggle(`player`);
    this.cell.classList.toggle(`dirt`);
  },
  detectEggCollision() {
    if (this.cell === egg.cell) {
      game.levelUp();
    }
  },
  detectFoxCollision() {
    if (this.cell.classList.contains(`fox`)) {
      game.gameOver(game.caughtByFox);
      game.isGameOver = true;
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
    case "Space":
      player.dig();
      break;
  }
});

const levels = [
  new Level(
    "Mother's Nest",
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
    "Rooster's Revenge",
    levelThreeMap,
    new Fox(
      [64, 54, 44, 34, 24, 14, 15, 14, 24, 34, 44, 54, 64, 63],
      board.gridArray[63]
    )
  ),
  new Level(
    "The Last Feather",
    levelFourMap,
    new Fox(
      [37, 36, 35, 34, 33, 32, 31, 32, 33, 34, 35, 36, 37, 38],
      board.gridArray[38]
    )
  ),
  new Level(
    "Farm Escape",
    levelFiveMap,
    new Fox(
      [77, 76, 75, 65, 66, 67, 68, 58, 57, 56, 55, 65, 66, 67, 68, 78],
      board.gridArray[78]
    )
  ),
  new Level(
    "Fox Den",
    levelSixMap,
    new Fox([54, 55, 54, 53], board.gridArray[53])
  ),
];
