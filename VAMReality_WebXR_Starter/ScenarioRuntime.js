
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
  display.innerHTML = `<h2>${step.name || `Step ${currentBlockIndex + 1}.${currentStepIndex + 1}`}</h2><p>${step.instructionText || ""}</p>`;

  const nextBtn = document.createElement("button");

  if (step.conditions && step.conditions.length > 0) {
    const cond = step.conditions[0]; // First defined condition
    nextBtn.textContent = `Next: ${cond.label}`;
    nextBtn.onclick = () => {
      currentBlockIndex = cond.target.block;
      currentStepIndex = cond.target.step;
      executeStep();
    };
  } else {
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      const block = scenarioStore.current.blocks[currentBlockIndex];
      if (currentStepIndex + 1 < block.steps.length) {
        currentStepIndex++;
      } else if (currentBlockIndex + 1 < scenarioStore.current.blocks.length) {
        currentBlockIndex++;
        currentStepIndex = 0;
      } else {
        display.innerHTML = "<h2>🎉 Scenario Complete!</h2>";
        return;
      }
      executeStep();
    };
  }

  display.appendChild(nextBtn);
}
