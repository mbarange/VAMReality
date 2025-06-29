
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

let editingIndex = null;
let editingBlockId = null;

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

  const scenario = scenarioStore.current;
  const blockId = scenarioStore.currentBlockId;

  if (!scenario || !blockId || !name) return;

  const step = { name, instructionText: instruction, images, videos, pdfs, models };

  const block = scenario.blocks.find(b => b.blockId === blockId);
  if (!block) return;

  if (editingIndex !== null && editingBlockId === blockId) {
    block.steps[editingIndex] = step;
  } else {
    block.steps.push(step);
  }

  editingIndex = null;
  editingBlockId = null;

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

window.editStep = function (blockId, stepIndex) {
  const scenario = scenarioStore.current;
  const block = scenario.blocks.find(b => b.blockId === blockId);
  if (!block) return;
  const step = block.steps[stepIndex];
  if (!step) return;

  document.getElementById("stepName").value = step.name;
  document.getElementById("instructionText").value = step.instructionText;
  document.getElementById("images").value = step.images.join(', ');
  document.getElementById("videos").value = step.videos.join(', ');
  document.getElementById("pdfs").value = step.pdfs.join(', ');
  document.getElementById("models").value = step.models.join(', ');

  editingIndex = stepIndex;
  editingBlockId = blockId;
};
