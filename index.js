// https://stackoverflow.com/questions/58482163/how-to-improve-html-canvas-performance-drawing-pixels

class Board {
  constructor(size) {
    this.size = size;
    this.grid = [];
    this.nextGrid = [];
    this.offsets = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1]
    ];
    this.color = "#000";
    this.bgColor = "#fff";
    this.cellsToDraw = [];
    this.state = false;
  }

  createBoard() {
    for (let y = 0; y < this.size; y++) {
      this.grid[y] = [];
      this.nextGrid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.grid[y].push(
          Math.random() > 0.81
        );
        this.nextGrid[y].push(false);
      }
    }
  }

  autoGeneration() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.grid[y][x] = Math.random() > 0.81;
      }
    }
  }

  // update(ctx, size) {
  update(callback) {
    let i = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        i++;
        if (!this.state) {
          this.nextGrid[y][x] = this.getNewValue(this.grid, x, y);
          callback(this.nextGrid[y][x], i);
          // if (this.nextGrid[y][x])
            // this.renderCell(ctx, x, y, size);
        } else {
          this.grid[y][x] = this.getNewValue(this.nextGrid, x, y);
          callback(this.grid[y][x], i);
          // if (this.grid[y][x])
            // this.renderCell(ctx, x, y, size);
        }
      }
    }
    this.state = !this.state;
  }

  renderCell(ctx, x, y, size) {
    ctx.fillStyle = this.color;
    ctx.fillRect(x * size, y * size, size, size);
  }
  
  getNewValue(grid, x, y) {
    const neighboursLength = this.getNeighbours(grid, x, y);
    
    if (!grid[y][x]) {
      return this.ruleOne(neighboursLength);
    } 
    
    return this.ruleTwo(neighboursLength);
  }

  getNeighbours(grid, x, y) {
    return (
      this.getNeighbour(grid, x - 1, y - 1) +
      this.getNeighbour(grid, x, y - 1) +
      this.getNeighbour(grid, x + 1, y - 1) +
      this.getNeighbour(grid, x - 1, y) +
      this.getNeighbour(grid, x + 1, y) +
      this.getNeighbour(grid, x - 1, y + 1) +
      this.getNeighbour(grid, x, y + 1) +
      this.getNeighbour(grid, x + 1, y + 1)
    )
  }

  getNeighbour(grid, x, y) {
    const length = grid.length;
    let _x = x, _y = y;
    if (x < 0) _x = length - 1;
    if (x > length - 1) _x = 0;
    if (y < 0) _y = length - 1;
    if (y > length - 1) _y = 0;

    return grid[_y][_x];
  }

  ruleOne(neighboursLength) {
    return neighboursLength === 3;
  }

  ruleTwo(neighboursLength) {
    return (neighboursLength === 2 || neighboursLength === 3); 
  }
}

function getMapSizeAndOffset() {
  const { width, height } = canvas;

  if (width > height) {
    return {
      size: height,
      x: (width - height) / 2,
      y: 0
    }
  } else {
    return {
      size: width,
      x: 0,
      y: (height - width) / 2
    }
  }
}

const GRID_SIZE = 500;
const board = new Board(GRID_SIZE);
board.createBoard();

const canvasWrapper = document.querySelector("main")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled= false;
canvas.width = canvas.height = GRID_SIZE;
// canvas.width = canvasWrapper.offsetWidth;
// canvas.height = canvasWrapper.offsetHeight;

const { size, x, y } = getMapSizeAndOffset();
const cellSize = size / GRID_SIZE;
const data = ctx.createImageData(GRID_SIZE, GRID_SIZE)
const buffer = new Uint32Array(data.data.buffer);

requestAnimationFrame(function draw() {
  ctx.save();
  ctx.scale(100, 100);
  // ctx.translate(x, y);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  // runWithExecutionCalc("update", () => board.update(ctx, cellSize));
  // board.update(ctx, cellSize);
  runWithExecutionCalc("update", () => board.update((state, index) => {
    buffer[index] = state ? 0xFF000000 : 0xFFFFFFFF;
  }));
  ctx.putImageData(data, x, y);
  ctx.restore();
  requestAnimationFrame(draw);
});

const runWithExecutionCalc = (label, fn) => {
  console.time(label);
  fn();
  console.timeEnd(label);
}