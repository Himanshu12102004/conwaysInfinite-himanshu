import GlobalVariables from '../globalVariables.js';
function drawGrid() {
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    let colorUniform = GlobalVariables.gl.getUniformLocation(GlobalVariables.program.line, 'userColor');
    GlobalVariables.gl.uniform3f(colorUniform, GlobalVariables.gridColor[0] / 255, GlobalVariables.gridColor[1] / 255, GlobalVariables.gridColor[2] / 255);
    GlobalVariables.gl.bindVertexArray(GlobalVariables.vao.line);
    GlobalVariables.gl.drawArrays(GlobalVariables.gl.LINES, 0, GlobalVariables.attribLength.line.vertex / 2);
}
function generateGridVertices() {
    let axes = [];
    let leftBoundX = Math.floor(GlobalVariables.bounds.minX);
    let rightBoundX = Math.floor(GlobalVariables.bounds.maxX);
    let topBoundY = Math.floor(GlobalVariables.bounds.maxY);
    let bottomBoundY = Math.floor(GlobalVariables.bounds.minY);
    for (let i = bottomBoundY; i <= topBoundY; i++) {
        let y = (2 * (i - GlobalVariables.bounds.minY)) /
            (GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY) -
            1;
        axes.push(-1, y, 1, y);
    }
    for (let i = leftBoundX; i <= rightBoundX; i++) {
        let x = (2 * (i - GlobalVariables.bounds.minX)) /
            (GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX) -
            1;
        axes.push(x, -1, x, 1);
    }
    return axes;
}
export { generateGridVertices, drawGrid };
