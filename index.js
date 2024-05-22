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
  }

  createBoard() {
    for (let y = 0; y < this.size; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.grid[y].push(
          Math.random() > 0.81
        );
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

  update() {
    for (let y = 0; y < this.size; y++) {
      this.nextGrid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.nextGrid[y].push(this.getNewValue(x, y));
      }
    }
    this.copyAndReset();
  }

  render(ctx, size) {
    // for (let y = 0; y < this.size; y++) {
    //   for (let x = 0; x < this.size; x++) {
    //     ctx.fillStyle = this.grid[y][x] ? this.color : this.bgColor;
    //     ctx.fillRect(x * size, y * size, size, size);
    //   }
    // }
    console.log(this.cellsToDraw.length)
    for (let i = 0; i < this.cellsToDraw.length; i++) {
      const [x, y] = this.cellsToDraw[i];
      ctx.fillStyle = this.color;
      ctx.fillRect(x * size, y * size, size, size);
    }
    this.cellsToDraw = [];
  }
  
  getNewValue(x, y) {
    const neighbours = this.getNeighbours(x, y);
    
    if (!this.grid[y][x]) {
      return this.ruleOne(neighbours);
    } 
    
    return this.ruleTwo(neighbours);
  }

  getNeighbours(x, y) {
    const neighbours = [];
    this.offsets.map((offset) => {
      const neighbour = this.getNeighbour(x + offset[0], y + offset[1]);
      if (neighbour != null)
        neighbours.push(neighbour);
    });
    return neighbours;
  }

  getNeighbour(x, y) {
    let _x = x, _y = y;
    if (x < 0) _x = this.grid.length - 1;
    if (x > this.grid.length - 1) _x = 0;
    if (y < 0) _y = this.grid.length - 1;
    if (y > this.grid.length - 1) _y = 0;

    return this.grid[_y][_x];
  }

  ruleOne(neighbours) {
    return neighbours.filter(n => n).length === 3;
  }

  ruleTwo(neighbours) {
    const count = neighbours.filter(n => n).length;
    return (count === 2 || count === 3); 
  }

  copyAndReset() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.grid[y][x] = this.nextGrid[y][x];
        this.nextGrid[y][x] = false;
        if (this.grid[y][x]) {
          this.cellsToDraw.push([x, y]);
        }
      }
    }
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
canvas.width = canvasWrapper.offsetWidth;
canvas.height = canvasWrapper.offsetHeight;

const { size, x, y } = getMapSizeAndOffset();
const cellSize = size / GRID_SIZE;

setInterval(() => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  board.update();
  board.render(ctx, cellSize);
  ctx.restore();
}, 1000 / 10);