import GlobalVariables from '../globalVariables.js';
function onSizeChange() {
    try {
        GlobalVariables.canvas.height = GlobalVariables.screenDimensions.height;
        GlobalVariables.canvas.width = GlobalVariables.screenDimensions.width;
        GlobalVariables.gl.viewport(0, 0, GlobalVariables.screenDimensions.width, GlobalVariables.screenDimensions.height);
    }
    catch (err) {
        console.log(err.message);
    }
}
export { onSizeChange };
