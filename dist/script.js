var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { shaderCompiler } from './helpers/compileShaders.js';
import { createProgram } from './helpers/createProgram.js';
import GlobalVariables from './globalVariables.js';
import { drawGrid } from './drivers/drawGrid.js';
import { CanvasEvents } from './drivers/events.js';
import { generateAndDrawBoxVertices } from './drivers/drawBoxes.js';
import calcNextGen from './drivers/conwayLogic.js';
import dat from 'https://cdn.skypack.dev/dat.gui';
let speed = GlobalVariables.speed;
let speedController;
document.addEventListener('DOMContentLoaded', () => {
    let svgs = document.querySelectorAll('svg');
    svgs.forEach((ele) => {
        console.log(ele);
        ele.setAttribute('fill', `rgb(${GlobalVariables.boxColor[0]},${GlobalVariables.boxColor[1]},${GlobalVariables.boxColor[2]})`);
    });
    document.querySelector('.generation').style.color = `rgb(${GlobalVariables.boxColor[0]},${GlobalVariables.boxColor[1]},${GlobalVariables.boxColor[2]})`;
    svgs[0].addEventListener('click', function () {
        GlobalVariables.speed = speed;
        speedController.updateDisplay();
        svgs[1].classList.remove('hide');
        svgs[0].classList.add('hide');
    });
    svgs[1].addEventListener('click', function () {
        speed = GlobalVariables.speed;
        GlobalVariables.speed = 0;
        speedController.updateDisplay();
        svgs[0].classList.remove('hide');
        svgs[1].classList.add('hide');
    });
    svgs[2].addEventListener('click', () => {
        speed = GlobalVariables.speed;
        GlobalVariables.speed = 0;
        speedController.updateDisplay();
        GlobalVariables.generationCount = 0;
        generation.innerHTML = `${GlobalVariables.generationCount} th generation`;
        svgs[0].classList.remove('hide');
        svgs[1].classList.add('hide');
        GlobalVariables.liveCells = new Set();
    });
});
function loadShader(shaderUrl) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', shaderUrl, true);
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    resolve(req.responseText);
                }
                else {
                    reject(new Error(`Failed to load shader: ${shaderUrl}`));
                }
            }
        };
        req.send();
    });
}
let count = 0;
let generation = document.querySelector('.generation');
let fps = document.querySelector('.fps');
let liveCells = document.querySelector('.liveCells');
let zoom = document.querySelector('.zoom');
let lastTime = 0;
function animate(timeStamp) {
    let deltaTime = -lastTime + timeStamp;
    lastTime = timeStamp;
    fps.innerHTML = `${Math.round(1000 / deltaTime)} FPS`;
    zoom.innerHTML = `Zoom: ${((GlobalVariables.screenDimensions.height *
        GlobalVariables.screenDimensions.width) /
        ((GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX) *
            (GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY))).toFixed(3)}x`;
    liveCells.innerHTML = `${GlobalVariables.liveCells.size} Live Cells`;
    count++;
    if (count == 100000000)
        count = 0;
    GlobalVariables.gl.clearColor(GlobalVariables.backgroundColor[0] / 255, GlobalVariables.backgroundColor[1] / 255, GlobalVariables.backgroundColor[2] / 255, 1);
    GlobalVariables.gl.clear(GlobalVariables.gl.COLOR_BUFFER_BIT | GlobalVariables.gl.DEPTH_BUFFER_BIT);
    generateAndDrawBoxVertices();
    if (GlobalVariables.showGrid) {
        GlobalVariables.gl.bindVertexArray(GlobalVariables.vao.line);
        drawGrid();
    }
    if (count % (GlobalVariables.maxSpeed - GlobalVariables.speed + 1) == 0 &&
        GlobalVariables.speed != 0) {
        calcNextGen();
        GlobalVariables.generationCount++;
        generation.innerHTML = `${GlobalVariables.generationCount} th generation`;
    }
    requestAnimationFrame(animate);
}
function compileShader(vertexShaderSource, fragmentShaderSource) {
    let vertexShader = shaderCompiler(vertexShaderSource, GlobalVariables.gl.VERTEX_SHADER, GlobalVariables.gl);
    let fragmentShader = shaderCompiler(fragmentShaderSource, GlobalVariables.gl.FRAGMENT_SHADER, GlobalVariables.gl);
    return { vertexShader, fragmentShader };
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let gui = new dat.GUI();
        let controlFolder = gui.addFolder('Controls');
        controlFolder
            .add(GlobalVariables, 'showGrid')
            .name('Show Grid')
            .onChange(CanvasEvents.reCalculateGrid);
        speedController = controlFolder
            .add(GlobalVariables, 'speed', 0, GlobalVariables.maxSpeed, 1)
            .name('Speed');
        controlFolder.open();
        let colorFolder = gui.addFolder('Colors');
        colorFolder
            .addColor(GlobalVariables, 'boxColor')
            .name('Cell Color')
            .onChange(() => {
            let svgs = document.querySelectorAll('svg');
            svgs.forEach((ele) => {
                console.log(ele);
                ele.setAttribute('fill', `rgb(${GlobalVariables.boxColor[0]},${GlobalVariables.boxColor[1]},${GlobalVariables.boxColor[2]})`);
            });
            document.querySelector('.generation').style.color = `rgb(${GlobalVariables.boxColor[0]},${GlobalVariables.boxColor[1]},${GlobalVariables.boxColor[2]})`;
            document.querySelector('.madeBy').style.color = `rgb(${GlobalVariables.boxColor[0]},${GlobalVariables.boxColor[1]},${GlobalVariables.boxColor[2]})`;
        });
        colorFolder.addColor(GlobalVariables, 'gridColor').name('Grid Color');
        colorFolder
            .addColor(GlobalVariables, 'backgroundColor')
            .name('Background Color');
        colorFolder.open();
        GlobalVariables.canvas = document.querySelector('canvas');
        GlobalVariables.gl = GlobalVariables.canvas.getContext('webgl2');
        if (!GlobalVariables.gl) {
            alert('Your browser does not support webgl2');
            return;
        }
        GlobalVariables.showGrid = true;
        GlobalVariables.graphScale.scale = 50;
        const vertexShaderLineSource = yield loadShader('./shaders/lines/lines.vs.glsl');
        const fragmentShaderLineSource = yield loadShader('./shaders/lines/lines.fs.glsl');
        GlobalVariables.shaders.line = compileShader(vertexShaderLineSource, fragmentShaderLineSource);
        GlobalVariables.program.line = createProgram(GlobalVariables.shaders.line.vertexShader, GlobalVariables.shaders.line.fragmentShader, GlobalVariables.gl);
        const vertexShaderBoxSource = yield loadShader('./shaders/boxes/boxes.vs.glsl');
        const fragmentShaderBoxSource = yield loadShader('./shaders/boxes/boxes.fs.glsl');
        GlobalVariables.shaders.box = compileShader(vertexShaderBoxSource, fragmentShaderBoxSource);
        GlobalVariables.program.box = createProgram(GlobalVariables.shaders.box.vertexShader, GlobalVariables.shaders.box.fragmentShader, GlobalVariables.gl);
        CanvasEvents.onResize();
        CanvasEvents.addEvents();
        liveCells.innerHTML = `${GlobalVariables.liveCells.size} Live Cells`;
        animate(0);
    });
}
// function download() {
//   const keys = Object.keys(patterns) as Array<keyof typeof patterns>;
//   let time = 0;
//   for (let index = 0; index < keys.length; index++) {
//     let key = keys[index];
//     if (index >= 3) break;
//     GlobalVariables.liveCells = parsePattern(patterns[key]);
//     GlobalVariables.boxColor[0] = Math.random() * 255;
//     GlobalVariables.boxColor[1] = Math.random() * 255;
//     GlobalVariables.boxColor[2] = Math.random() * 255;
//     GlobalVariables.gl.clearColor(
//       GlobalVariables.backgroundColor[0] / 255,
//       GlobalVariables.backgroundColor[1] / 255,
//       GlobalVariables.backgroundColor[2] / 255,
//       1
//     );
//     GlobalVariables.gl.clear(
//       GlobalVariables.gl.COLOR_BUFFER_BIT | GlobalVariables.gl.DEPTH_BUFFER_BIT
//     );
//     generateAndDrawBoxVertices();
//     if (GlobalVariables.showGrid) {
//       GlobalVariables.gl.bindVertexArray(GlobalVariables.vao.line);
//       drawGrid();
//     }
//     const canvas = GlobalVariables.canvas;
//     const dataUrl = canvas.toDataURL('image/png');
//     const img = new Image();
//     img.src = dataUrl;
//     const link = document.createElement('a');
//     link.href = dataUrl;
//     link.download = `${key}.png`;
//     link.click();
//   }
// }
init();
let rulesBtn = document.querySelector('.rulesBtn');
let rulesShown = false;
rulesBtn === null || rulesBtn === void 0 ? void 0 : rulesBtn.addEventListener('click', () => {
    rulesShown = !rulesShown;
    rulesElem();
});
let rules = document.querySelector('.rules');
function rulesElem() {
    if (rulesShown) {
        rules.style.display = 'block';
        rulesBtn.innerHTML = 'Hide Rules';
    }
    else {
        rules.style.display = 'none';
        rulesBtn.innerHTML = 'See Rules';
    }
}
function addListenerToRules() {
    const tempMap = new Map();
    function updateRules() {
        GlobalVariables.rules.clear();
        tempMap.forEach((value, key) => {
            if (value[0]) {
                GlobalVariables.rules.set(key, value);
            }
        });
    }
    function handleCheckboxChange() {
        tempMap.clear();
        for (let i = 1; i <= 8; i++) {
            const values = [];
            for (let j = 1; j <= 2; j++) {
                const id = `checkbox${i}-${j}`;
                const checkbox = document.querySelector(`#${id}`);
                if (checkbox) {
                    values.push(checkbox.checked);
                }
            }
            tempMap.set(i, values);
        }
        updateRules();
    }
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 2; j++) {
            const id = `checkbox${i}-${j}`;
            const checkbox = document.querySelector(`#${id}`);
            if (checkbox) {
                checkbox.addEventListener('change', handleCheckboxChange);
            }
        }
    }
}
addListenerToRules();
function initializeCheckboxes() {
    GlobalVariables.rules.forEach((value, key) => {
        for (let j = 1; j <= 2; j++) {
            const id = `checkbox${key}-${j}`;
            const checkbox = document.querySelector(`#${id}`);
            if (checkbox) {
                checkbox.checked = value[j - 1];
            }
        }
    });
}
initializeCheckboxes();
