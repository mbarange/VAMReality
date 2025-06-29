
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

let editingIndex = null;

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

  if (editingIndex !== null) {
    scenarioStore.current.steps[editingIndex] = step;
    editingIndex = null;
  } else {
    scenarioStore.current.steps.push(step);
  }

  renderCurrentScenario();
  clearInputs();
};

function clearInputs() {
  document.getElementById("stepName").value = "";
  document.getElementById("instructionText").value = "";
  document.getElementById("images").value = "";
  document.getElementById("videos").value = "";
  document.getElementById("pdfs").value = "";
  document.getElementById("models").value = "";
}

window.editStep = function (index) {
  const step = scenarioStore.current.steps[index];
  if (!step) return;

  document.getElementById("stepName").value = step.name;
  document.getElementById("instructionText").value = step.instructionText;
  document.getElementById("images").value = step.images.join(', ');
  document.getElementById("videos").value = step.videos.join(', ');
  document.getElementById("pdfs").value = step.pdfs.join(', ');
  document.getElementById("models").value = step.models.join(', ');

  editingIndex = index;
};

window.handleDrop = function (event, targetIndex) {
  event.preventDefault();
  const sourceIndex = event.dataTransfer.getData("text/plain");
  const steps = scenarioStore.current.steps;

  if (sourceIndex !== targetIndex) {
    const moved = steps.splice(sourceIndex, 1)[0];
    steps.splice(targetIndex, 0, moved);
    renderCurrentScenario();
  }
};

window.allowDrop = function (event) {
  event.preventDefault();
};

window.dragStart = function (event, index) {
  event.dataTransfer.setData("text/plain", index);
};
