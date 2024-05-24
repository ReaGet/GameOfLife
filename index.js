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
    this.gridLength = 0;
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
    // let i = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        // i++;
        // const index = (x + this.size * y) * 4;
        // if (!this.state) {
        //   this.nextGrid[y][x] = this.getNewValue(this.grid, x, y);
        //   callback(this.nextGrid[y][x], index);
        // } else {
        //   this.grid[y][x] = this.getNewValue(this.nextGrid, x, y);
        //   callback(this.grid[y][x], index);
        // }
      }
    }
    this.state = !this.state;
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
    // const length = this.size;
    let _x = 0, _y = 0;
    // let _x = x, _y = y;
    // if (x < 0) _x = length - 1;
    // if (x > length - 1) _x = 0;
    // if (y < 0) _y = length - 1;
    // if (y > length - 1) _y = 0;

    return grid[_y][_x];
  }

  ruleOne(neighboursLength) {
    return neighboursLength === 3;
  }

  ruleTwo(neighboursLength) {
    return (neighboursLength === 2 || neighboursLength === 3); 
  }
}

const sourceCanvas = document.createElement("canvas");

const GRID_SIZE = 5000;
const board = new Board(GRID_SIZE);
board.createBoard();

const canvasWrapper = document.querySelector("main")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled= false;
sourceCanvas.width = sourceCanvas.height = GRID_SIZE;
const ctx2 = sourceCanvas.getContext("2d");

// canvas.width = canvasWrapper.offsetWidth;
// canvas.height = canvasWrapper.offsetHeight;
canvas.width = canvas.height = Math.min(canvasWrapper.offsetWidth, canvasWrapper.offsetHeight);

const getScale = (a, b) => {
  return Math.min(a, b) / Math.max(a, b);
}

const data = ctx2.createImageData(GRID_SIZE, GRID_SIZE);
const scale = Math.max(1, getScale(GRID_SIZE, canvas.width));
console.log(scale, GRID_SIZE, canvas.width)

requestAnimationFrame(function draw() {
  runWithExecutionCalc("update", () => board.update((state, index) => {
    const color = state ? 0 : 255;
    data.data[index] = color;
    data.data[index + 1] = color;
    data.data[index + 2] = color;
    data.data[index + 3] = 255;
  }));
  // board.update((state, index) => {
  //   const color = state ? 0 : 255;
  //   data.data[index] = color;
  //   data.data[index + 1] = color;
  //   data.data[index + 2] = color;
  //   data.data[index + 3] = 255;
  // })
  // ctx.save();
  // ctx2.putImageData(data, 0, 0);
  // ctx.scale(scale, scale);
  // ctx.drawImage(sourceCanvas, 0, 0)
  // ctx.restore();
  requestAnimationFrame(draw);
});

const runWithExecutionCalc = (label, fn) => {
  console.time(label);
  fn();
  console.timeEnd(label);
}

const arr = new Ui