
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

let stepCounter = 0;

export function initializeStepBuilder() {
  document.getElementById('stepList').innerHTML = '';
}

window.addStep = function () {
  const name = document.getElementById("scenarioName").value.trim();
  if (!name || !scenarioStore.current) return;

  scenarioStore.current.steps.push(name);
  renderCurrentScenario();
  document.getElementById("scenarioName").value = ""; // Clear input
};
