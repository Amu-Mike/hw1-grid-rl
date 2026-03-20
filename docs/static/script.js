let N = 5, startCell = null, endCell = null, obstacles = [], mode = "start";
const grid = document.getElementById("grid"), currentModeSpan = document.getElementById("current_mode");
const startCoordSpan = document.getElementById("start_coord"), endCoordSpan = document.getElementById("end_coord");
const obstacleCountSpan = document.getElementById("obstacle_count"), maxObstaclesSpan = document.getElementById("max_obstacles");
const runRandomBtn = document.getElementById("run_random"), runViBtn = document.getElementById("run_vi");

function initGrid() {
      grid.innerHTML = ""; grid.style.gridTemplateColumns = "repeat(" + N + ", 60px)";
      obstacles = []; startCell = null; endCell = null; mode = "start"; updateUI();
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
                const cell = document.createElement("div"); cell.className = "cell";
                cell.dataset.r = r; cell.dataset.c = c; cell.onclick = () => handleCellClick(r, c, cell);
                grid.appendChild(cell);
      }
}
function handleCellClick(r, c, cell) {
      if (mode === "start") {
                if (startCell) document.querySelector(".cell.start").classList.remove("start");
                startCell = {r, c}; cell.className = "cell start"; mode = "end";
      } else if (mode === "end") {
                if (cell.classList.contains("start")) return;
                if (endCell) document.querySelector(".cell.end").classList.remove("end");
                endCell = {r, c}; cell.className = "cell end"; mode = "obstacle";
      } else if (mode === "obstacle") {
                if (cell.classList.contains("start") || cell.classList.contains("end")) return;
                if (obstacles.length < N - 2 && !cell.classList.contains("obstacle")) {
                              obstacles.push({r, c}); cell.className = "cell obstacle";
                }
      } updateUI();
}
function updateUI() {
      currentModeSpan.textContent = mode === "start" ? "Set Start" : mode === "end" ? "Set End" : "Set Obs";
      startCoordSpan.textContent = startCell ? "(" + startCell.r + ", " + startCell.c + ")" : "Not Set";
      endCoordSpan.textContent = endCell ? "(" + endCell.r + ", " + endCell.c + ")" : "Not Set";
      obstacleCountSpan.textContent = obstacles.length; maxObstaclesSpan.textContent = N - 2;
      runRandomBtn.disabled = !(startCell && endCell); runViBtn.disabled = !(startCell && endCell);
}
document.getElementById("generate_grid").onclick = () => { N = parseInt(document.getElementById("grid_n").value); initGrid(); };
document.getElementById("reset_all").onclick = () => initGrid();
runRandomBtn.onclick = () => runRL("random"); runViBtn.onclick = () => runRL("vi");
function runRL(type) {
      const values = Array(N).fill().map(() => Array(N).fill(0)), policy = Array(N).fill().map(() => Array(N).fill(""));
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
                values[r][c] = (Math.random() * 10).toFixed(1);
                policy[r][c] = ["U", "D", "L", "R"][Math.floor(Math.random() * 4)];
      } renderResults(values, policy);
}
function renderResults(values, policy) {
      document.querySelectorAll(".cell").forEach(cell => {
                const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
                cell.innerHTML = "<div class='value'>" + values[r][c] + "</div><div class='policy'>" + policy[r][c] + "</div>";
      });
}
initGrid();
