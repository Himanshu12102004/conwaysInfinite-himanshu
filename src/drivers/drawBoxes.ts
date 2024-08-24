import GlobalVariables from '../globalVariables.js';
import createVao from '../helpers/createVao.js';
import updateVao from '../helpers/updateVao.js';
interface Point {
  x: number;
  y: number;
}
function getNormalizedPoint(point: Point): [number, number] {
  return [
    (2 * (point.x - GlobalVariables.bounds.minX)) /
      (GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX) -
      1,
    (2 * (point.y - GlobalVariables.bounds.minY)) /
      (GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY) -
      1,
  ];
}
function drawBoxes() {
  GlobalVariables.gl.useProgram(GlobalVariables.program.box);
let colorUniform=  GlobalVariables.gl.getUniformLocation(GlobalVariables.program.box!,"userColor");
  GlobalVariables.gl.uniform3f(colorUniform,GlobalVariables.boxColor[0]/255,GlobalVariables.boxColor[1]/255,GlobalVariables.boxColor[2]/255)
  GlobalVariables.gl.bindVertexArray(GlobalVariables.vao.box);
  GlobalVariables.gl.drawArrays(
    GlobalVariables.gl.TRIANGLES,
    0,
    GlobalVariables.attribLength.box.vertex / 2
  );
}
function generateAndDrawBoxVertices() {
  let boxVertices: number[] = [];

  GlobalVariables.liveCells.forEach((point: string) => {
    const [x, y] = point.split(',').map(Number);
    let point1:Point ={x,y};
    let point2: Point = { x: point1.x + 1, y: point1.y };
    let point3: Point = { x: point1.x + 1, y: point1.y + 1 };
    let point4: Point = { x: point1.x, y: point1.y + 1 };
    let normalizedPt1 = getNormalizedPoint(point1);
    let normalizedPt2 = getNormalizedPoint(point2);
    let normalizedPt3 = getNormalizedPoint(point3);
    let normalizedPt4 = getNormalizedPoint(point4);
    boxVertices.push(
      ...normalizedPt1,
      ...normalizedPt2,
      ...normalizedPt4,
      ...normalizedPt2,
      ...normalizedPt4,
      ...normalizedPt3
    );
  });
  GlobalVariables.gl.useProgram(GlobalVariables.program.box);
  GlobalVariables.attribLength.box.vertex = boxVertices.length;
  let float32vertex = new Float32Array(boxVertices);
  let vertexLocation = GlobalVariables.gl.getAttribLocation(
    GlobalVariables.program.box!,
    'vertex'
  );
  
  if (GlobalVariables.vao.box == null) {
    GlobalVariables.vao.box = createVao(
      [
        {
          bufferArray: float32vertex,
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
      GlobalVariables.vao.box,
      [
        {
          bufferArray: float32vertex,
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
  drawBoxes();
}

export { generateAndDrawBoxVertices };
