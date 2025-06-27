
import { scenarioManager } from './main.js';

function parseList(input) {
  return input.split(',').map(s => s.trim()).filter(Boolean);
}

function setupUI() {
  const addBtn = document.getElementById("addStepBtn");
  const list = document.getElementById("stepList");

  addBtn.onclick = () => {
    const step = {
      stepName: document.getElementById("stepName").value,
      stepType: document.getElementById("stepType").value,
      instructionText: document.getElementById("instructionText").value,
      instructionImages: parseList(document.getElementById("imageNames").value),
      instructionVideos: parseList(document.getElementById("videoNames").value),
      instructionPDFPaths: parseList(document.getElementById("pdfNames").value),
      instructionModels: parseList(document.getElementById("modelNames").value),
      resourcePlacements: []
    };

    scenarioManager.addStep(step);
    const item = document.createElement("li");
    item.textContent = step.stepName + " [" + step.stepType + "]";
    list.appendChild(item);
    clearInputs();
  };
}

function clearInputs() {
  document.getElementById("stepName").value = "";
  document.getElementById("stepType").value = "Instruction";
  document.getElementById("instructionText").value = "";
  document.getElementById("imageNames").value = "";
  document.getElementById("videoNames").value = "";
  document.getElementById("pdfNames").value = "";
  document.getElementById("modelNames").value = "";
}

window.addEventListener("DOMContentLoaded", setupUI);
