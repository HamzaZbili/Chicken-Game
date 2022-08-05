const grid = document.getElementById(`grid`)

function startGame(){
    buildGameBoard(10, 10)
    
}

function buildGameBoard (height, width) {
    //builds square gameboard based on width/height arguments
    for (let i = 0; i < height * width; i++) {
        const cell = document.createElement(`div`)
        cell.classList.add(`gridSquare`)
        cell.dataset.index = i
        grid.append(cell)
    }
}

startGame()