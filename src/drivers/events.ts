import GlobalVariables from '../globalVariables.js';
import createVao from '../helpers/createVao.js';
import updateVao from '../helpers/updateVao.js';
import { generateGridVertices } from './drawGrid.js';
class CanvasEvents {
  static isPanning = false;
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static addEvents() {
    window.addEventListener('resize', () => {
      CanvasEvents.onResize();
    });
    GlobalVariables.canvas.addEventListener('wheel', (e) => {
      CanvasEvents.onZoom(e);
    });
    GlobalVariables.canvas.addEventListener('mousemove', (e) => {
      CanvasEvents.onPan(e);
    });
    GlobalVariables.canvas.addEventListener('mousedown', (e) => {
      CanvasEvents.isDragging = false;
      CanvasEvents.dragStartX = e.clientX;
      CanvasEvents.dragStartY = e.clientY;
    });
    GlobalVariables.canvas.addEventListener('mouseup', (e) => {
      const dragEndX = e.clientX;
      const dragEndY = e.clientY;
      const distance = Math.hypot(
        dragEndX - CanvasEvents.dragStartX,
        dragEndY - CanvasEvents.dragStartY
      );

      if (distance < 5) {
        CanvasEvents.onclick(e);
      } else {
        CanvasEvents.isDragging = true;
      }
    });
  }
  static onResize(e: MouseEvent | undefined = undefined) {
    GlobalVariables.screenDimensions.height = innerHeight;
    GlobalVariables.screenDimensions.width = innerWidth;
    GlobalVariables.canvas!.height = GlobalVariables.screenDimensions.height;
    GlobalVariables.canvas!.width = GlobalVariables.screenDimensions.width;
    if (
      GlobalVariables.screenDimensions.height < 500 ||
      GlobalVariables.screenDimensions.width < 500
    ) {
      obstruct(true);
    } else obstruct(false);
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.screenDimensions.width,
      GlobalVariables.screenDimensions.height
    );

    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    if (GlobalVariables.showGrid) {
      let myAxes = new Float32Array(generateGridVertices());
      GlobalVariables.attribLength.line.vertex = myAxes.length;
      GlobalVariables.gl.useProgram(GlobalVariables.program.line);
      let vertexLocation = GlobalVariables.gl.getAttribLocation(
        GlobalVariables.program.line!,
        'vertex'
      );

      if (GlobalVariables.vao.line == null) {
        GlobalVariables.vao.line = createVao(
          [
            {
              bufferArray: myAxes,
              type: GlobalVariables.gl.ARRAY_BUFFER,
              location: vertexLocation,
              howToRead: 2,
              normalized: false,
              startFrom: 0,
            },
          ],
          GlobalVariables.gl
        );
      } else {
        updateVao(
          GlobalVariables.vao.line,
          [
            {
              bufferArray: myAxes,
              type: GlobalVariables.gl.ARRAY_BUFFER,
              location: vertexLocation,
              howToRead: 2,
              normalized: false,
              startFrom: 0,
            },
          ],
          GlobalVariables.gl
        );
      }
    }
  }
  static onZoom(e: WheelEvent) {
    if (e.deltaY > 0)
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 0.95;
    else
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 1.05;
    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    if (GlobalVariables.showGrid) {
      let myAxes = new Float32Array(generateGridVertices());
      GlobalVariables.attribLength.line.vertex = myAxes.length;
      GlobalVariables.gl.useProgram(GlobalVariables.program.line);
      let vertexLocation = GlobalVariables.gl.getAttribLocation(
        GlobalVariables.program.line!,
        'vertex'
      );
      updateVao(
        GlobalVariables.vao.line!,
        [
          {
            bufferArray: myAxes,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }
  static onPan(e: MouseEvent) {
    if (e.buttons === 1) {
      var iRange = GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY;
      var rRange = GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX;
      var iDelta = (e.movementY / GlobalVariables.canvas.clientHeight) * iRange;
      var rDelta = (e.movementX / GlobalVariables.canvas.clientWidth) * rRange;
      GlobalVariables.bounds.minY += iDelta;
      GlobalVariables.bounds.maxY += iDelta;
      GlobalVariables.bounds.minX -= rDelta;
      GlobalVariables.bounds.maxX -= rDelta;
      GlobalVariables.canvas.style.cursor = 'grabbing';
      let myAxes = new Float32Array(generateGridVertices());
      GlobalVariables.attribLength.line.vertex = myAxes.length;
      GlobalVariables.gl.useProgram(GlobalVariables.program.line);
      if (GlobalVariables.showGrid) {
        let vertexLocation = GlobalVariables.gl.getAttribLocation(
          GlobalVariables.program.line!,
          'vertex'
        );

        updateVao(
          GlobalVariables.vao.line!,
          [
            {
              bufferArray: myAxes,
              type: GlobalVariables.gl.ARRAY_BUFFER,
              location: vertexLocation,
              howToRead: 2,
              normalized: false,
              startFrom: 0,
            },
          ],
          GlobalVariables.gl
        );
      }
    } else {
      GlobalVariables.canvas.style.cursor = 'default';
    }
  }
  static onclick(e: MouseEvent) {
    let distance = GlobalVariables.graphScale.scale;
    let rightBound = GlobalVariables.screenDimensions.width / (2 * distance);
    let topBound = GlobalVariables.screenDimensions.height / (2 * distance);
    let leftBound = -rightBound;
    let bottomBound = -topBound;
    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    let x = Math.floor(
      (e.clientX * (rightBound - leftBound)) /
        GlobalVariables.screenDimensions.width +
        leftBound +
        centerX
    );
    let y = Math.floor(
      -(
        (e.clientY * (topBound - bottomBound)) /
          GlobalVariables.screenDimensions.height +
        bottomBound
      ) + centerY
    );
    if (GlobalVariables.liveCells.has(`${x},${y}`))
      GlobalVariables.liveCells.delete(`${x},${y}`);
    else GlobalVariables.liveCells.add(`${x},${y}`);
  }
  static reCalculateGrid() {
    if (GlobalVariables.showGrid) {
      let myAxes = new Float32Array(generateGridVertices());
      GlobalVariables.attribLength.line.vertex = myAxes.length;
      GlobalVariables.gl.useProgram(GlobalVariables.program.line);
      let vertexLocation = GlobalVariables.gl.getAttribLocation(
        GlobalVariables.program.line!,
        'vertex'
      );
      updateVao(
        GlobalVariables.vao.line!,
        [
          {
            bufferArray: myAxes,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }
}
export { CanvasEvents };
const blur = document.querySelector('.blur') as HTMLDivElement;
const obstructed = document.querySelector('.obstructed') as HTMLDivElement;
function obstruct(toObstruct: boolean) {
  if (toObstruct) {
    blur.style.display = 'flex';
    obstructed.style.display = 'flex';
  } else {
    blur.style.display = 'none';
    obstructed.style.display = 'none';
  }
}
