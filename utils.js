export const runWithExecutionCalc = (el, fn) => {
  const date = new Date();
  fn();
  if (el)
    el.innerHTML = `${new Date() - date} ms`;
}

export const getCorrectXY = (event, canvas) => {
  const x = event.pageX - canvas.offsetLeft,
    y = event.pageY - canvas.offsetTop;
  
  const scale = getCanvasScale(canvas);

  return [x * scale, y * scale];
}

export const getCanvasScale = (canvas) => {
  return canvas.width / canvas.offsetWidth;
}