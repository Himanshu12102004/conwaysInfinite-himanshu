function parsePattern(pattern) {
    let splitedPattern = pattern.split('\n');
    let height = splitedPattern.length;
    let width = splitedPattern[0].length;
    let originX = -Math.floor(width / 2);
    let originY = +Math.floor(height / 2);
    let liveCells = new Set();
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            try {
                if (splitedPattern[i].charAt(j) == 'O') {
                    let coord = `${j + originX},${originY - i}`;
                    liveCells.add(coord);
                }
            }
            catch (err) {
                console.log(i);
            }
        }
    }
    return liveCells;
}
export default parsePattern;
