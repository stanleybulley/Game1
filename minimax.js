var board
const huPlayer = "o"
const aiPlayer = "x"

const winning_test = document.querySelector("[data-winning-text]")
const winning_message = document.querySelector("#winning-message")
const restartBtn = document.querySelector("#restartBtn")
const cellElements = document.querySelectorAll(".cell")

const winning_condition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

startGame()
restartBtn.addEventListener("click", startGame)

function startGame() {
  winning_message.classList.remove("show")
  board = Array.from(Array(9).keys())
  cellElements.forEach((cell, index) => {
    cell.classList.remove("x")
    cell.classList.remove("o")
    cell.addEventListener("click", (e) => turnClick(e, index), false)
  })
}

function turnClick(e, index) {
  if (typeof board[index] == "number") {
    turn(index, huPlayer)

    if (!checkWin(board, huPlayer).win && !checkTie()) {
      turn(bestSpot(), aiPlayer)
    }
    if (checkTie()) {
      Draw()
    }
  }
}

function turn(index, player) {
  board[index] = player
  for (let i = 0; i < cellElements.length; i++) {
    if (i === index) {
      cellElements[index].classList.add(player)
    }
  }
  let gameWon = checkWin(board, player)
  if (gameWon.win) gameOver(gameWon)
}

function checkWin(board, player) {
  let gameWon = {}
  let plays = []
  board.map((item, index) => (item === player ? plays.push(index) : false))

  winning_condition.some((condition) => {
    return condition.every((elem) =>
      plays.includes(elem) ? (gameWon.win = true) : (gameWon.win = false)
    )
  })
  gameWon.player = player
  return gameWon
}

function gameOver(gameWon, draw) {
  if (!draw) {
    winning_test.innerText = `${gameWon.player} wins`
    winning_message.classList.add("show")
  }
}

function Draw() {
  winning_test.innerText = `Tie`
  winning_message.classList.add("show")
}

function emptyPlace(board) {
  return board.filter((s) => typeof s == "number")
}

function bestSpot() {
  // return emptyPlace()[0] // no AI for computer turn

  return minimax(board, aiPlayer).index
}

function checkTie() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains("x") || cell.classList.contains("o")
  })
}

function minimax(newBoard, player) {
  let availSpots = emptyPlace(newBoard) //finding empty place

  if (checkWin(newBoard, huPlayer).win) {
    return { score: -10 }
  } else if (checkWin(newBoard, aiPlayer).win) {
    return { score: 10 }
  } else if (availSpots.length === 0) {
    return { score: 0 }
  } else {
    let moves = []

    for (var i = 0; i < availSpots.length; i++) {
      let move = {}

      move.index = newBoard[availSpots[i]]
      newBoard[availSpots[i]] = player

      if (player == aiPlayer) {
        let result = minimax(newBoard, huPlayer)
        move.score = result.score
      } else {
        let result = minimax(newBoard, aiPlayer)
        move.score = result.score
      }

      //reset the spot to empty
      newBoard[availSpots[i]] = move.index

      moves.push(move)
    }

    let bestMove
    if (player === aiPlayer) {
      let bestScore = -Infinity
      for (let i = 0; i < moves.length; i++) {
        if (bestScore < moves[i].score) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    } else {
      let bestScore = Infinity
      for (let i = 0; i < moves.length; i++) {
        if (bestScore > moves[i].score) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }

    return moves[bestMove]
  }
}
