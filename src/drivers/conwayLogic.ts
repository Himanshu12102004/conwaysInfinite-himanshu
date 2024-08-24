import GlobalVariables from '../globalVariables.js';

function checkCondition(count: number, myKey: string): boolean {
  const rulesEntries = GlobalVariables.rules.entries(); // Use the iterator directly

  for (const [noOfCellsAlive, value] of rulesEntries) {
    if (value[0] && value[1]) {
      if (count === noOfCellsAlive && GlobalVariables.liveCells.has(myKey)) {
        return true;
      }
    } else if (value[0] && !value[1]) {
      if (count === noOfCellsAlive) {
        return true;
      }
    }
  }

  return false;
}

function calcNextGen() {
  const neighborCount: Map<string, number> = new Map();

  GlobalVariables.liveCells.forEach((cell) => {
    const [x, y] = cell.split(',').map(Number);
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i === x && j === y) continue;
        const key = `${i},${j}`;
        neighborCount.set(key, (neighborCount.get(key) || 0) + 1);
      }
    }
  });

  const nextGen: Set<string> = new Set();

  neighborCount.forEach((count, key) => {
    if (checkCondition(count, key)) {
      nextGen.add(key);
    }
  });

  GlobalVariables.liveCells = nextGen;
}

export default calcNextGen;
