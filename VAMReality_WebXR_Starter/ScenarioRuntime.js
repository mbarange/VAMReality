
import { scenarioStore } from './ScenarioManager.js';

let currentBlockIndex = 0;
let currentStepIndex = 0;

export function runScenario() {
  currentBlockIndex = 0;
  currentStepIndex = 0;
  executeStep();
}

function executeStep() {
  const scenario = scenarioStore.current;
  if (!scenario || !scenario.blocks || scenario.blocks.length === 0) return;

  const block = scenario.blocks[currentBlockIndex];
  const step = block?.steps?.[currentStepIndex];
  if (!step) return;

  showStep(step);
}

function showStep(step) {
  const display = document.getElementById("stepDisplay");
  display.innerHTML = `<h2>${step.name}</h2><p>${step.instructionText}</p>`;

  if (step.conditions && step.conditions.length > 0) {
    const condDiv = document.createElement("div");
    condDiv.innerHTML = "<strong>Choose next:</strong><br/>";
    step.conditions.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c.label;
      btn.onclick = () => {
        const blkIndex = scenarioStore.current.blocks.findIndex(b => b.blockId === c.targetBlock);
        if (blkIndex >= 0) {
          currentBlockIndex = blkIndex;
          currentStepIndex = c.targetStep - 1;
          executeStep();
        }
      };
      condDiv.appendChild(btn);
    });
    display.appendChild(condDiv);
  } else {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      nextStep();
    };
    display.appendChild(nextBtn);
  }
}

function nextStep() {
  const scenario = scenarioStore.current;
  const block = scenario.blocks[currentBlockIndex];

  if (currentStepIndex + 1 < block.steps.length) {
    currentStepIndex++;
  } else if (currentBlockIndex + 1 < scenario.blocks.length) {
    currentBlockIndex++;
    currentStepIndex = 0;
  } else {
    document.getElementById("stepDisplay").innerHTML = "<h2>🎉 Scenario Complete!</h2>";
    return;
  }

  executeStep();
}
export function resetScenario() {
  currentBlockIndex = 0;
  currentStepIndex = 0;
  document.getElementById("stepDisplay").innerHTML = "";
}