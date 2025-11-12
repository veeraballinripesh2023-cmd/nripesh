// === Banker’s Algorithm Simulator ===
// Developed for Nripesh (Dark Theme Version)

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate");
  const runBtn = document.getElementById("run");
  const output = document.getElementById("output");

  let n = 0, m = 0;

  generateBtn.addEventListener("click", () => {
    n = parseInt(document.getElementById("processes").value);
    m = parseInt(document.getElementById("resources").value);
    if (n <= 0 || m <= 0) {
      alert("Please enter valid positive numbers for processes and resources.");
      return;
    }
    createTables(n, m);
    output.textContent = "Tables generated. Please fill the values and click 'Run Banker’s Algorithm'.";
  });

  runBtn.addEventListener("click", () => {
    const allocation = getMatrixValues("alloc", n, m);
    const max = getMatrixValues("max", n, m);
    const available = getAvailableValues(m);

    if (!allocation || !max || !available) {
      alert("Please fill all input fields before running the algorithm.");
      return;
    }

    const result = bankersAlgorithm(allocation, max, available);
    output.textContent = result;
  });

  // --- Helper Functions ---
  function createTables(n, m) {
    const allocSection = document.getElementById("allocation-section");
    const maxSection = document.getElementById("max-section");
    const availSection = document.getElementById("available-section");

    allocSection.innerHTML = `<h3>Allocation Matrix</h3>${generateTableHTML("alloc", n, m)}`;
    maxSection.innerHTML = `<h3>Max Matrix</h3>${generateTableHTML("max", n, m)}`;
    availSection.innerHTML = `<h3>Available Resources</h3>${generateAvailableHTML("avail", m)}`;
  }

  function generateTableHTML(prefix, n, m) {
    let html = "<table><tr><th>Process</th>";
    for (let j = 0; j < m; j++) html += `<th>R${j}</th>`;
    html += "</tr>";

    for (let i = 0; i < n; i++) {
      html += `<tr><td>P${i}</td>`;
      for (let j = 0; j < m; j++) {
        html += `<td><input type='number' id='${prefix}-${i}-${j}' min='0' value='0'></td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  }

  function generateAvailableHTML(prefix, m) {
    let html = "<table><tr>";
    for (let j = 0; j < m; j++) html += `<th>R${j}</th>`;
    html += "</tr><tr>";
    for (let j = 0; j < m; j++) html += `<td><input type='number' id='${prefix}-${j}' min='0' value='0'></td>`;
    html += "</tr></table>";
    return html;
  }

  function getMatrixValues(prefix, n, m) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < m; j++) {
        const val = document.getElementById(`${prefix}-${i}-${j}`).value;
        if (val === "") return null;
        row.push(parseInt(val));
      }
      matrix.push(row);
    }
    return matrix;
  }

  function getAvailableValues(m) {
    const available = [];
    for (let j = 0; j < m; j++) {
      const val = document.getElementById(`avail-${j}`).value;
      if (val === "") return null;
      available.push(parseInt(val));
    }
    return available;
  }

  // --- Banker’s Algorithm Logic ---
  function bankersAlgorithm(allocation, max, available) {
    const n = allocation.length;
    const m = available.length;

    const need = Array.from({ length: n }, (_, i) =>
      Array.from({ length: m }, (_, j) => max[i][j] - allocation[i][j])
    );

    const finish = Array(n).fill(false);
    const safeSequence = [];

    const work = [...available];

    for (let k = 0; k < n; k++) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          let canProceed = true;
          for (let j = 0; j < m; j++) {
            if (need[i][j] > work[j]) {
              canProceed = false;
              break;
            }
          }
          if (canProceed) {
            for (let j = 0; j < m; j++) work[j] += allocation[i][j];
            safeSequence.push(`P${i}`);
            finish[i] = true;
            found = true;
          }
        }
      }
      if (!found) break;
    }

    const isSafe = finish.every(f => f);
    if (isSafe)
      return `✅ System is in a SAFE STATE.\nSafe Sequence: ${safeSequence.join(" → ")}`;
    else
      return "⚠️ System is in DEADLOCK (Unsafe State).";
  }
});
