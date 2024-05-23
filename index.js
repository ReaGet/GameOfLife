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

  update() {
    for (let y = 0; y < this.size; y++) {
      // this.nextGrid[y] = [];
      for (let x = 0; x < this.size; x++) {
        // this.nextGrid[y].push(this.getNewValue(x, y));
        if (!this.state) {
          this.nextGrid[y][x] = this.getNewValue(this.grid, x, y);
          this.createArrayToDraw(this.nextGrid, x, y);
        } else {
          this.grid[y][x] = this.getNewValue(this.nextGrid, x, y);
          this.createArrayToDraw(this.grid, x, y);
        }
      }
    }
    this.state = !this.state;
    // this.copyAndReset();
  }

  createArrayToDraw(grid, x, y) {
    if (grid[y][x]) {
      this.cellsToDraw.push([x, y]);
    }
  }

  render(ctx, size) {
    // for (let y = 0; y < this.size; y++) {
    //   for (let x = 0; x < this.size; x++) {
    //     ctx.fillStyle = this.grid[y][x] ? this.color : this.bgColor;
    //     ctx.fillRect(x * size, y * size, size, size);
    //   }
    // }
    for (let i = 0; i < this.cellsToDraw.length; i++) {
      const [x, y] = this.cellsToDraw[i];
      ctx.fillStyle = this.color;
      ctx.fillRect(x * size, y * size, size, size);
    }
    this.cellsToDraw = [];
  }
  
  getNewValue(grid, x, y) {
    const neighbours = this.getNeighbours(grid, x, y);
    
    if (!grid[y][x]) {
      return this.ruleOne(neighbours);
    } 
    
    return this.ruleTwo(neighbours);
  }

  getNeighbours(grid, x, y) {
    const neighbours = [];
    this.offsets.map((offset) => {
      const neighbour = this.getNeighbour(grid, x + offset[0], y + offset[1]);
      if (neighbour != null)
        neighbours.push(neighbour);
    });
    return neighbours;
  }

  getNeighbour(grid, x, y) {
    let _x = x, _y = y;
    if (x < 0) _x = grid.length - 1;
    if (x > grid.length - 1) _x = 0;
    if (y < 0) _y = grid.length - 1;
    if (y > grid.length - 1) _y = 0;

    return grid[_y][_x];
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

const GRID_SIZE = 1000;
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

requestAnimationFrame(function draw() {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  board.update();
  board.render(ctx, cellSize);
  ctx.restore();
  requestAnimationFrame(draw);
});
