import { createBuffer } from './createBuffer.js';
function updateVao(vao, bufferInfoArray, gl) {
    gl.bindVertexArray(vao);
    bufferInfoArray.forEach((bufferInfo) => {
        const bufferArray = bufferInfo.bufferArray;
        const gpuBuffer = createBuffer(bufferArray, bufferInfo.type, gl);
        if (!gpuBuffer) {
            console.error('Unable to create or update GPU buffer');
            return;
        }
        gl.enableVertexAttribArray(bufferInfo.location);
        gl.bindBuffer(bufferInfo.type, gpuBuffer);
        gl.vertexAttribPointer(bufferInfo.location, bufferInfo.howToRead, gl.FLOAT, bufferInfo.normalized, 0, bufferInfo.startFrom);
    });
}
export default updateVao;
