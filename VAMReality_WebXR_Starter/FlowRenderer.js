import { scenarioStore } from "./ScenarioManager.js";

const flowContainer = document.getElementById("flowContainer");

export function drawScenarioGraph() {
  flowContainer.innerHTML = ""; // Clear old content

  if (!scenarioStore.current || !scenarioStore.current.blocks) return;

  let yOffset = 0;

  scenarioStore.current.blocks.forEach((block, blockIndex) => {
    const blockEl = document.createElement("div");
    blockEl.className = "flow-block";
    blockEl.innerHTML = `<h3>Block ${blockIndex + 1}</h3>`;
    const stepMap = {};

    block.steps.forEach((step, stepIndex) => {
      const stepId = `${blockIndex + 1}.${stepIndex + 1}`;
      const stepEl = document.createElement("div");
      stepEl.className = "flow-step";
      stepEl.innerText = `${stepId} ${step.name}`;
      stepEl.id = `step-${stepId}`;
      stepMap[stepId] = stepEl;

      stepEl.style.top = `${yOffset + stepIndex * 100}px`;
      stepEl.style.left = `${blockIndex * 300}px`;
      flowContainer.appendChild(stepEl);
    });

    // Draw arrows
    block.steps.forEach((step, i) => {
      const stepId = `${blockIndex + 1}.${i + 1}`;
      const from = document.getElementById(`step-${stepId}`);

      // Default sequential arrow
      if (i < block.steps.length - 1) {
        const toId = `${blockIndex + 1}.${i + 2}`;
        const to = document.getElementById(`step-${toId}`);
        drawArrow(from, to);
      }

      // Conditional arrows
      if (step.conditions) {
        step.conditions.forEach((cond, idx) => {
          const toId = `${cond.block}.${cond.step}`;
          const to = document.getElementById(`step-${toId}`);
          if (to) {
            drawArrow(from, to, cond.label || `Cond ${idx + 1}`);
          }
        });
      }
    });

    yOffset += block.steps.length * 100 + 60;
  });
}

function drawArrow(from, to, labelText = "") {
  const line = document.createElement("div");
  line.className = "arrow";
  const label = document.createElement("span");
  label.className = "arrow-label";
  label.innerText = labelText;

  // Calculate positions
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  const x1 = from.offsetLeft + from.offsetWidth;
  const y1 = from.offsetTop + from.offsetHeight / 2;
  const x2 = to.offsetLeft;
  const y2 = to.offsetTop + to.offsetHeight / 2;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;

  label.style.left = `${(x1 + x2) / 2}px`;
  label.style.top = `${(y1 + y2) / 2}px`;

  flowContainer.appendChild(line);
  flowContainer.appendChild(label);
}