export class Board {
  constructor() {
    this.isArt = false;
  }

  init(imageData, width, height) {
    this.isArt = false;
    this.width = width;
    this.height = height;
    this.gridLength = this.width * this.height;
    this.grid = new Uint8Array(this.gridLength);
    this.tempGrid = new Uint8Array(this.gridLength);
    this.imageData = imageData;

    for (let i = 0; i < imageData.data.length; i += 4) {
      this.tempGrid[i / 4] = imageData.data[i] === 0 ? 1 : 0;
    }
  }

  nextGen() {
    for (let i = 0; i < this.gridLength; i++) {
      if (this.grid[i] && this.isArt) continue;
      const newValue = this.getNewValue(this.tempGrid, i);
      const color = newValue ? 0 : 255;
      this.grid[i] = newValue;

      this.imageData.data[i * 4] = color;
      this.imageData.data[i * 4 + 1] = color;
      this.imageData.data[i * 4 + 2] = color;
      this.imageData.data[i * 4 + 3] = 255;
    }
    this.tempGrid = this.grid.slice(0, this.gridLength);
    return this.imageData;
  }

  getNewValue(grid, index) {
    const neighboursLength = this.getNeighbours(grid, index);

    if (!grid[index]) return neighboursLength === 3 ? 1 : 0;
    return (neighboursLength === 2 || neighboursLength === 3) ? 1 : 0;
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
}