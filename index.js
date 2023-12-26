// index.js
import * as Rotate from './rotate.js';

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("tetrisCanvas");
  const context = canvas.getContext("2d");

  const ROWS = 20;
  const COLUMNS = 10;
  const BLOCK_SIZE = 30;
  const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

  let currentPiece;
  spawnPiece();

  function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = "#fff";
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  function drawBoard(color) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        if (board[row][col] !== 0) {
          drawSquare(col, row, color);
        }
      }
    }
  }


  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawCurrentPiece();
  }

  function drawCurrentPiece() {
    const { shape, position, color } = currentPiece;
    shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          drawSquare(position.x + colIndex, position.y + rowIndex, color);
        }
      });
    });
  }

  function moveDown() {
    currentPiece.position.y++;
    if (collides()) {
      currentPiece.position.y--;
      mergePiece();
      spawnPiece();
    }
  }

  function moveRight() {
    currentPiece.position.x++;
    if (collides()) {
      currentPiece.position.x--;
    }
  }

  function moveLeft() {
    currentPiece.position.x--;
    if (collides()) {
      currentPiece.position.x++;
    }
  }

  function rotateClockwise() {
    Rotate.rotateClockwise(currentPiece, collides, draw);
  }

  function rotate() {
    const originalShape = currentPiece.shape;
    currentPiece.shape = Rotate.rotateMatrix(originalShape);
    if (collides()) {
      currentPiece.shape = originalShape;
    }
  }

  function collides() {
    const { shape, position } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (
          shape[row][col] !== 0 &&
          (board[row + position.y] && board[row + position.y][col + position.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function mergePiece() {
    const { shape, position, color } = currentPiece;
    shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          board[rowIndex + position.y][colIndex + position.x] = color;
        }
      });
    });
    clearRows();
  }

  function clearRows() {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row].every((cell) => cell !== 0)) {
        board.splice(row, 1);
        board.unshift(Array(COLUMNS).fill(0));
      }
    }
  }

  function spawnPiece() {
    const pieces = [
      { shape: [[1, 1, 1, 1]], color: "#FFD700" }, // I
      { shape: [[1, 1, 1], [1,0,0]], color: "#a45d43" }, // L
      { shape: [[1, 1, 1], [1, 0, 0]], color: "#8A2BE2" }, // J
      { shape: [[1, 1], [1, 1]], color: "#00CED1" }, // O
      { shape: [[1, 1, 1], [0, 0, 1]], color: "#32CD32" }, // S
      { shape: [[1, 1, 1], [0, 1, 0]], color: "#8a51a2" }, // T
      { shape: [[1, 1, 0], [0, 1, 1]], color: "#FF69B4" }, // Z
    ];

    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = {
      shape: randomPiece.shape,
      position: { x: Math.floor(COLUMNS / 2) - Math.floor(randomPiece.shape[0].length / 2), y: 0 },
      color: randomPiece.color,
    };

    if (collides()) {
      // Game over
      resetGame();
    }
  }

  function resetGame() {
    alert("Oyun bitti! Yeniden başlamak için sayfayı yenileyin.");
    board.forEach((row) => row.fill(0));
    draw();
  }

  function handleKeyPress(event) {
    switch (event.key) {
      case "ArrowUp":
        rotate();
        break;
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowLeft":
        moveLeft();
        break;
      case " ":
        rotateClockwise(); // Boşluk tuşuna basıldığında saat yönünde döndür
        break;
    }
    draw();
  }

  document.addEventListener("keydown", handleKeyPress);



  // Dışarıya Tetris objesini taşı
  window.Tetris = {
    currentPiece,
    draw,
    Rotate, // rotate.js'deki fonksiyonları Tetris objesine dahil et

    // Diğer fonksiyonları da ekleyebilirsiniz
  };


  function gameLoop() {
    moveDown();
    draw();
    setTimeout(gameLoop, 500); // Her çerçeve arasında 500 milisaniye beklet

  }

  // spawnPiece fonksiyonu gameLoop fonksiyonundan önce çağrılmalı
  spawnPiece();
  gameLoop();

  document.addEventListener("keydown", handleKeyPress);;

  function rotateClockwise() {
    console.log("Before rotation:", currentPiece.shape);
    Rotate.rotateClockwise(currentPiece, collides, draw);
    console.log("After rotation:", currentPiece.shape);
  }
});
