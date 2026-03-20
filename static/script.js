let N = 5;
let startCell = null;
let endCell = null;
let obstacles = [];

const ARROWS = {
      'up': 'U',
      'down': 'D',
      'left': 'L',
      'right': 'R'
};

document.addEventListener('DOMContentLoaded', () => {
      const btnGenerate = document.getElementById('btn-generate');
      const gridSizeInput = document.getElementById('grid-size');
      const btnRandom = document.getElementById('btn-random-policy');
      const btnValueIter = document.getElementById('btn-value-iteration');

                              btnGenerate.addEventListener('click', () => {
                                        N = parseInt(gridSizeInput.value);
                                        if (N < 5 || N > 9) {
                                                      alert('Please enter a number between 5 and 9.');
                                                      return;
                                        }
                                        resetGrid();
                                        renderGrid('main', document.getElementById('grid-container'));
                                        document.getElementById('grid-title').innerText = `${N} x ${N} Square`;
                                        document.getElementById('action-buttons').classList.remove('hidden');
                                        document.getElementById('results-area').classList.add('hidden');
                                        updateInstructions();
                              });

                              btnRandom.addEventListener('click', () => runRL('/api/random_policy'));
      btnValueIter.addEventListener('click', () => runRL('/api/value_iteration'));
});

function resetGrid() {
      startCell = null;
      endCell = null;
      obstacles = [];
}

function onCellClick(e) {
      const r = parseInt(e.currentTarget.dataset.r);
      const c = parseInt(e.currentTarget.dataset.c);
      const cell = e.currentTarget;

    if (!startCell) {
              startCell = [r, c];
              cell.classList.add('start');
              cell.innerHTML = '<div class="cell-label">START</div>';
    } else if (!endCell && (r !== startCell[0] || c !== startCell[1])) {
              endCell = [r, c];
              cell.classList.add('end');
              cell.innerHTML = '<div class="cell-label">END</div>';
    } else if (obstacles.length < N - 2 && (r !== startCell[0] || c !== startCell[1]) && (r !== endCell[0] || c !== endCell[1])) {
              if (!obstacles.some(o => o[0] === r && o[1] === c)) {
                            obstacles.push([r, c]);
                            cell.classList.add('obstacle');
                            cell.innerHTML = '<div class="cell-label">OBS</div>';
              }
    }
      updateInstructions();
}

function renderGrid(type, container, results = null) {
      container.innerHTML = '';
      container.style.gridTemplateColumns = `repeat(${N}, 50px)`;

    for (let r = 0; r < N; r++) {
              for (let c = 0; c < N; c++) {
                            const cell = document.createElement('div');
                            cell.className = 'cell';
                            cell.dataset.r = r;
                            cell.dataset.c = c;

                  if (type === 'main') {
                                    cell.addEventListener('click', onCellClick);
                  } else if (results) {
                                    if (startCell && r === startCell[0] && c === startCell[1]) cell.classList.add('start');
                                    if (endCell && r === endCell[0] && c === endCell[1]) cell.classList.add('end');
                                    if (obstacles.some(o => o[0] === r && o[1] === c)) cell.classList.add('obstacle');

                                if (type === 'value') {
                                                      const v = results.values[r][c];
                                                      cell.innerHTML = `<div class="value-dot">${v !== null ? v.toFixed(2) : '-'}</div>`;
                                } else {
                                                      const act = results.policy[r][c];
                                                      cell.innerHTML = `<div class="arrow">${ARROWS[act] || ''}</div>`;
                                }
                  }
                            container.appendChild(cell);
              }
    }
}

async function runRL(endpoint) {
      if (!startCell || !endCell || obstacles.length < N - 2) {
                alert('Please complete the setup first.');
                return;
      }

    const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ n: N, start: startCell, end: endCell, obstacles: obstacles })
    });
      const data = await res.json();

    document.getElementById('results-area').classList.remove('hidden');
      renderGrid('value', document.getElementById('value-grid'), data);
      renderGrid('policy', document.getElementById('policy-grid'), data);
}
