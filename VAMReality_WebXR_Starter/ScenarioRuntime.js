
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

  const scenario = scenarioStore.current;

  if (step.conditions && step.conditions.length > 0) {
    step.conditions.forEach((cond, idx) => {
      if (!cond.target) return;

      const btn = document.createElement("button");
      btn.textContent = cond.label || `Condition ${idx + 1}`;
      btn.onclick = () => {
        currentBlockIndex = cond.target.block;
        currentStepIndex = cond.target.step;
        executeStep();
      };
      display.appendChild(btn);
    });
  } else {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      const block = scenario.blocks[currentBlockIndex];
      if (currentStepIndex + 1 < block.steps.length) {
        currentStepIndex++;
      } else if (currentBlockIndex + 1 < scenario.blocks.length) {
        currentBlockIndex++;
        currentStepIndex = 0;
      } else {
        display.innerHTML = "<h2>🎉 Scenario Complete!</h2>";
        return;
      }
      executeStep();
    };
    display.appendChild(nextBtn);
  }
}