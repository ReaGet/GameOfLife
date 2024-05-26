// https://stackoverflow.com/questions/58482163/how-to-improve-html-canvas-performance-drawing-pixels

// 00 -> 0 Prev: dead, current: dead
// 01 -> 1 Prev: dead, current: alive
// 10 -> 2 Prev: alive, current: dead
// 11 -> 3 Prev: alive, current: alive
class Board {
  constructor(size) {
    this.size = size;
    this.grid = [];
    this.tempGrid = null;
    this.gridLength = 0;
  }

  createBoard() {
    this.grid = new Uint8Array(this.size * this.size);
    this.tempGrid = new Uint8Array(this.size * this.size);

    for(let i = 0; i < this.grid.length; i++) {
      const value = Math.random() > 0.81 ? 1 : 0;
      this.grid[i] = value;
      this.tempGrid[i] = value;
    }
    this.gridLength = this.grid.length;
    // console.log(this.grid)
    // this.update();
    // console.log(this.grid)
    // console.log(this.tempGrid)
  }

  autoGeneration() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.grid[y][x] = Math.random() > 0.81 ? 1 : 0;
      }
    }
  }

  update(callback = () => {}) {
    for (let i = 0; i < this.grid.length; i++) {       
      const newValue = this.getNewValue(this.tempGrid, i);
      this.grid[i] = newValue;
      // console.log(newValue)
      callback(this.grid[i], i);
    }
    // this.tempGrid = this.grid.slice(0, this.grid.length);
    this.tempGrid = this.grid.slice(0, this.grid.length);
  }
  
  getNewValue(grid, index) {
    const neighboursLength = this.getNeighbours(grid, index);
    // console.log(neighboursLength)
    
    if (!grid[index]) {
      return this.ruleOne(neighboursLength);
    } 
    
    return this.ruleTwo(neighboursLength);
  }

  getNeighbours(grid, index) {
    const x = index % this.size,
        y = ~~(index / this.size);


    const top = index + (y == 0 ? this.gridLength - this.size : -this.size);
    const bottom = index + ((y == (this.size - 1)) ? -(this.gridLength - this.size) : this.size);
    const left = x == 0 ? this.size - 1 : -1;
    const right = x == (this.size - 1) ? -(this.size - 1) : 1;
    // // console.log(`topleft: ${index+topLeft}, top: ${index+top}, topright: ${index+topRight}`);
    // // console.log(`left: ${index+left}, center: ${index}, right: ${index+right}`);
    // // console.log(`bottomleft: ${index+bottomLeft}, bottom: ${index+bottom}, bottomright: ${index+bottomRight}`);

    return (
      grid[top] + 
      grid[bottom] +
      grid[index + left] + 
      grid[index + right] + 
      grid[top + left] +
      grid[top + right] + 
      grid[bottom + left] + 
      grid[bottom + right]
    )
  }

  ruleOne(neighboursLength) {
    return neighboursLength === 3 ? 1 : 0;
  }

  ruleTwo(neighboursLength) {
    return (neighboursLength === 2 || neighboursLength === 3) ? 1 : 0; 
  }
}

const sourceCanvas = document.createElement("canvas");

const GRID_SIZE = 1500;
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
  // return Math.min(a, b) / Math.max(a, b);
  if (a < b) {
    return a / b;
  }
  return b / a;
}

const data = ctx2.createImageData(GRID_SIZE, GRID_SIZE);
const scale = getScale(GRID_SIZE, canvas.width);

requestAnimationFrame(function draw() {
  runWithExecutionCalc("update", () => board.update((state, index) => {
    const color = state ? 0 : 255;
    data.data[index * 4] = color;
    data.data[index * 4 + 1] = color;
    data.data[index * 4 + 2] = color;
    data.data[index * 4 + 3] = 255;
  }));
  ctx.save();
  ctx2.putImageData(data, 0, 0);
  ctx.scale(scale, scale);
  ctx.drawImage(sourceCanvas, 0, 0)
  ctx.restore();
  requestAnimationFrame(draw);
})

const runWithExecutionCalc = (label, fn) => {
  // console.time(label);
  fn();
  // console.timeEnd(label);
}