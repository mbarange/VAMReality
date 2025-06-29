
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

export function initializeStepBuilder() {
  document.getElementById('stepList').innerHTML = '';
}

window.addStep = function () {
  const name = document.getElementById("stepName").value.trim();
  const instruction = document.getElementById("instructionText").value.trim();
  const images = document.getElementById("images").value.split(',').map(s => s.trim()).filter(Boolean);
  const videos = document.getElementById("videos").value.split(',').map(s => s.trim()).filter(Boolean);
  const pdfs = document.getElementById("pdfs").value.split(',').map(s => s.trim()).filter(Boolean);
  const models = document.getElementById("models").value.split(',').map(s => s.trim()).filter(Boolean);

  if (!name || !scenarioStore.current) return;

  const step = {
    name,
    instructionText: instruction,
    images,
    videos,
    pdfs,
    models
  };

  scenarioStore.current.steps.push(step);
  renderCurrentScenario();

  // Clear fields
  document.getElementById("stepName").value = "";
  document.getElementById("instructionText").value = "";
  document.getElementById("images").value = "";
  document.getElementById("videos").value = "";
  document.getElementById("pdfs").value = "";
  document.getElementById("models").value = "";
};
