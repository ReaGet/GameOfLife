import { getCorrectXY, runWithExecutionCalc,getCanvasScale } from "./utils.js";
import { Board } from "./board.js";

const board = new Board();

let isRunning = false,
  isClicked = false,
  prevMousePos = [];

const UI = {
  width: document.querySelector("#width"),
  height: document.querySelector("#height"),
  generate: document.querySelector("#generate"),
  start: document.querySelector("#start"),
  art: document.querySelector("#art"),
  time: document.querySelector("#time"),
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", {
  willReadFrequently: true,
});
let imageData = null;

requestAnimationFrame(function step() {
  if (isRunning) {
    runWithExecutionCalc(UI.time, () => {
      const newImageData = board.nextGen();
      ctx.putImageData(newImageData, 0, 0);
    });
  }
  
  requestAnimationFrame(step);
});

canvas.addEventListener("mousedown", (event) => {
  if (isRunning) return;
  isClicked = true;
  prevMousePos = getCorrectXY(event, canvas);
});

canvas.addEventListener("mousemove", (event) => {
  if (!isClicked) return;
  const [x, y] = getCorrectXY(event, canvas);
  const [prevX, prevY] = prevMousePos;
    
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "gap";
  ctx.lineWidth = 10 * getCanvasScale(canvas);
  ctx.stroke();
  ctx.closePath();
  prevMousePos = [x, y];
});

document.addEventListener("mouseup", (event) => {
  isClicked = false;
});

const generate = () => {
  console.log("generate");
  runWithExecutionCalc(UI.time, () => {
    for (let i = 0; i < imageData.data.length; i += 4) {
      const color = Math.random() > 0.9 ? 0 : 255;
      imageData.data[i] = color;
      imageData.data[i + 1] = color;
      imageData.data[i + 2] = color;
      imageData.data[i + 3] = 255; 
    }
    ctx.putImageData(imageData, 0, 0);
  });
}

const toggleUI = () => {
  UI.start.innerHTML = !isRunning ? "Начать игру" : "Остановить игру";
  UI.generate.disabled = isRunning;
  UI.width.disabled = isRunning;
  UI.height.disabled = isRunning;
  UI.art.disabled = isRunning;
}

const startStop = () => {
  console.log("start/stop");
  isRunning = !isRunning;
  toggleUI();
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  board.init(imageData, canvas.width, canvas.height);
}

const startStopArt = () => {
  console.log("start/stop art");
  if (!board.isArt) {
    startStop();
  } else {
    isRunning = false;
    toggleUI();
  }
  
  board.isArt = !board.isArt;
}

const init = () => {
  canvas.width = +UI.width.value;
  canvas.height = +UI.height.value;
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const handleInputChange = (event) => {
  init();
}

UI.generate.onclick = generate;
UI.start.onclick = startStop;
UI.art.onclick = startStopArt;
UI.width.onchange = handleInputChange;
UI.height.onchange = handleInputChange;

init();