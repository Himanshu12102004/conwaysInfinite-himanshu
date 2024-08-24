export function createBuffer(cpuArray, bufferType, gl) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, cpuArray, gl.STATIC_DRAW);
    return buffer;
}
