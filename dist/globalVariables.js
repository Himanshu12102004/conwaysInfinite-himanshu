class GlobalVariables {
}
GlobalVariables.bounds = { maxX: 0, minX: 0, maxY: 0, minY: 0 };
GlobalVariables.graphScale = { scale: 1 };
GlobalVariables.screenDimensions = { height: 600, width: 800 };
GlobalVariables.shaders = {
    line: {
        fragmentShader: null,
        vertexShader: null,
    },
    box: {
        fragmentShader: null,
        vertexShader: null,
    },
};
GlobalVariables.program = {
    line: null,
    box: null,
};
GlobalVariables.vao = {
    line: null,
    box: null,
};
GlobalVariables.canvas = null;
GlobalVariables.showGrid = true;
GlobalVariables.attribLength = {
    line: {
        vertex: 0,
    },
    box: { vertex: 0, color: 0 },
};
GlobalVariables.liveCells = new Set();
GlobalVariables.speed = 98;
GlobalVariables.generationCount = 0;
GlobalVariables.maxSpeed = 100;
GlobalVariables.boxColor = [255, 255, 255];
GlobalVariables.gridColor = [50, 50, 50];
GlobalVariables.backgroundColor = [0, 0, 0];
GlobalVariables.rules = new Map([
    [2, [true, true]],
    [3, [true, false]],
]);
GlobalVariables.backendUrl = 'https://conwaysinfinite.onrender.com/api/v1';
export default GlobalVariables;
