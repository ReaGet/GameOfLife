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
      callback(this.grid[i], i);
    }
    this.tempGrid = this.grid.slice(0, this.grid.length);
  }
  
  getNewValue(grid, index) {
    const neighboursLength = this.getNeighbours(grid, index);
    
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

    // const x = index % 3000,
    //     y = ~~(index / 3000);

    // const top = index + (y == 0 ? 9000000 - 3000 : -3000);
    // const bottom = index + ((y == (3000 - 1)) ? -(9000000 - 3000) : 3000);
    // const left = x == 0 ? 3000 - 1 : -1;
    // const right = x == (3000 - 1) ? -(3000 - 1) : 1;

    // return 0;

    const count = grid[top] + 
      grid[bottom] +
      grid[index + left] + 
      grid[index + right] + 
      grid[top + left] +
      grid[top + right] + 
      grid[bottom + left] + 
      grid[bottom + right];

    return count;
  }

  ruleOne(neighboursLength) {
    return neighboursLength === 3 ? 1 : 0;
  }

  ruleTwo(neighboursLength) {
    return (neighboursLength === 2 || neighboursLength === 3) ? 1 : 0; 
  }
}

const timeEl = document.querySelector("#time");

const sourceCanvas = document.createElement("canvas");

const GRID_SIZE = 1000;
const board = new Board(GRID_SIZE);
board.createBoard();

const canvasWrapper = document.querySelector("main")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled= false;
sourceCanvas.width = sourceCanvas.height = GRID_SIZE;
const ctx2 = sourceCanvas.getContext("2d");

canvas.width = canvas.height = Math.min(canvasWrapper.offsetWidth, canvasWrapper.offsetHeight);

const getScale = (canvas, grid) => {
  const cw = canvas.width,
    ch = canvas.height,
    gw = grid.width,
    gh = grid.height;

  console.log(cw, ch)
  console.log(gw, gh)
  
  if (cw < gw || ch < gh) {
    if (gw < gh) {
      if(gw > cw) {
        return cw / gw;
      }
    } else {
      if(gw > cw) {
        return cw / gw;
      }
    }

  }

  return 1;
}

const data = ctx2.createImageData(GRID_SIZE, GRID_SIZE);
const scale = getScale(canvas, { width: GRID_SIZE, height: GRID_SIZE });
console.log(getScale(GRID_SIZE, canvas.width), scale)

requestAnimationFrame(function draw() {
  ctx.fillStyle = "red"
  ctx.fillRect(0, 0, 100, 100);
  runWithExecutionCalc("update", () => board.update((state, index) => {
    const color = state ? 0 : 255;
    data.data[index * 4] = color;
    data.data[index * 4 + 1] = color;
    data.data[index * 4 + 2] = color;
    data.data[index * 4 + 3] = 255;
  }));
  ctx.save();
  ctx2.putImageData(data, 0, 0);
  // ctx.scale(scale, scale);/
  ctx.drawImage(sourceCanvas, 0, 0)
  ctx.restore();
  requestAnimationFrame(draw);
})

const runWithExecutionCalc = (label, fn) => {
  const date = new Date();
  // console.time(label);
  fn();
  // console.timeEnd(label);
  timeEl.innerHTML = `${new Date() - date} ms`;
}