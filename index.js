class Board {
  init(imageData, width, height) {
    this.width = width;
    this.height = height
    this.grid = imageData;
    this.tempGrid = imageData;
    this.gridLength = imageData.data.length / 4;
    this.autoGenerate();
  }

  autoGenerate() {
    for(let i = 0; i < this.grid.data.length; i += 4) {
      const value = Math.random() > 0.1 ? 1 : 0;
      this.setCell(this.grid, i, value);
    }
  }

  nextGen() {
    for (let i = 0; i < this.grid.data.length; i += 4) {       
      const value = this.getNewValue(this.tempGrid, i);
      this.setCell(this.grid, i, value);
    }
    this.tempGrid = this.grid;
  }

  setCell(grid, index, value) {
    const color = value ? 0 : 255;
    console.log(color)
    grid.data[index] = color;
    grid.data[index + 1] = color;
    grid.data[index + 2] = color;
    grid.data[index + 3] = 255;
  }
  
  getNewValue(grid, index) {
    const neighboursLength = this.getNeighbours(grid, index);
    if (!grid[index]) return this.ruleOne(neighboursLength);
    return this.ruleTwo(neighboursLength);
  }

  getNeighbours(grid, index) {
    const x = index % this.width,
        y = ~~(index / this.width);

    const left = x == 0 ? this.width - 1 : -1;
    const right = x == (this.width - 1) ? -(this.width - 1) : 1;
    const top = index + (y == 0 ? this.gridLength - this.width : -this.width);
    const bottom = index + ((y == (this.height - 1)) ? -(this.gridLength - this.width) : this.width);

    return (
      grid[top] + 
      grid[bottom] +
      grid[index + left] + 
      grid[index + right] + 
      grid[top + left] +
      grid[top + right] + 
      grid[bottom + left] + 
      grid[bottom + right]
    );
  }

  ruleOne(neighboursLength) {
    return neighboursLength === 3 ? 1 : 0;
  }

  ruleTwo(neighboursLength) {
    return (neighboursLength === 2 || neighboursLength === 3) ? 1 : 0; 
  }
}

const timeEl = document.querySelector("#time");
let start = false;

const UI = {
  width: document.querySelector("#width"),
  height: document.querySelector("#height"),
  generate: document.querySelector("#generate"),
  start: document.querySelector("#start"),
}

const GRID = {
  width: 0,
  height: 0,
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false;

let data = [];

const board = new Board();

const init = () => {
  canvas.width = GRID.width = +UI.width.value;   
  canvas.height = GRID.height = +UI.height.value;
  data = ctx.createImageData(GRID.width, GRID.height);
  board.init(data, GRID.width, GRID.height);
}

const update = () => {
  runWithExecutionCalc(() => {
    board.nextGen();
  });
  console.log(board.grid)
  ctx.putImageData(board.grid, 0, 0);
}

requestAnimationFrame(function step() {
  if (start) {
    update();
  }
  
  requestAnimationFrame(step);
});

const runWithExecutionCalc = (fn) => {
  const date = new Date();
  fn();
  timeEl.innerHTML = `${new Date() - date} ms`;
}

UI.generate.onclick = () => {
  board.autoGenerate();
  update();
}

UI.start.onclick = () => {
  start = !start;
  UI.start.innerHTML = !start ? "Начать игру" : "Остановить игру";
}

init();