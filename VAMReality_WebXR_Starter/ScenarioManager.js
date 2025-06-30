
export const scenarioStore = {
  current: null,
  all: []
};

export function createScenario() {
  const name = document.getElementById("newScenarioName").value.trim();
  if (!name) return alert("Please enter a scenario name.");

  const newScenario = {
    name,
    blocks: []
  };
  scenarioStore.current = newScenario;
  scenarioStore.all.push(newScenario);
  updateScenarioList();
  updateBlockSelector();
  renderCurrentScenario();
  alert("✅ Scenario created: " + name);
}

export function loadSelectedScenario() {
  const selector = document.getElementById("scenarioList");
  const selectedName = selector.value;
  if (!selectedName) return alert("No scenario selected");

  fetch(selectedName)
    .then(res => res.json())
    .then(data => {
      scenarioStore.current = data;
      updateBlockSelector();
      renderCurrentScenario();
    })
    .catch(err => alert("❌ Failed to load scenario: " + err));
}

export function addBlock() {
  if (!scenarioStore.current) return alert("Create or load a scenario first.");
  const newBlock = { id: scenarioStore.current.blocks.length + 1, steps: [] };
  scenarioStore.current.blocks.push(newBlock);
  updateBlockSelector();
  renderCurrentScenario();
}

export function addStep() {
  const blockIndex = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[blockIndex];
  if (!block) return alert("Select a block.");

  const step = {
    name: document.getElementById("stepName").value.trim(),
    type: document.getElementById("stepType").value,
    instructionText: document.getElementById("stepInstruction").value,
    voiceCommand: document.getElementById("stepVoice").value,
    instructionKeyTextPoints: splitByComma("stepKeyPoints"),
    instructionImages: splitByComma("stepImages"),
    instructionVideos: splitByComma("stepVideos"),
    instructionPDFPaths: splitByComma("stepPDFs"),
    instructionModels: splitByComma("stepModels"),
    POIReferencePoints: splitByComma("stepPOIRefs"),
    resourcePlacements: [],
    conditions: []
  };

  block.steps.push(step);
  renderCurrentScenario();
}

export function saveStep() {
  alert("Step saved (stub)");
}

export function addCondition() {
  const blockIdx = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[blockIdx];
  if (!block || !block.steps.length) return;

  const currentStep = block.steps[block.steps.length - 1];
  const label = document.getElementById("conditionLabel").value;
  const targetBlock = parseInt(document.getElementById("conditionBlockSelect").value);
  const targetStep = parseInt(document.getElementById("conditionStepSelect").value);

  currentStep.conditions = currentStep.conditions || [];
  currentStep.conditions.push({
    label,
    target: { block: targetBlock, step: targetStep }
  });

  renderCurrentScenario();
}

export function saveConditions() {
  alert("Conditions saved (stub)");
}

export function updateScenarioList() {
  const list = document.getElementById("scenarioList");
  const current = scenarioStore.current;
  if (!list.querySelector(`option[value="${current.name}"]`)) {
    const opt = document.createElement("option");
    opt.text = current.name;
    opt.value = current.name;
    list.appendChild(opt);
  }
}

export function updateBlockSelector() {
  const selector = document.getElementById("blockSelector");
  if (!selector) return;
  selector.innerHTML = "";
  scenarioStore.current.blocks.forEach((block, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = "Block " + (i + 1);
    selector.appendChild(opt);
  });
}

export function renderCurrentScenario() {
  const stepList = document.getElementById("stepList");
  if (!stepList) return;
  stepList.innerHTML = "";
  scenarioStore.current.blocks.forEach((block, bIdx) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    blockDiv.innerHTML = `<h4>Block ${bIdx + 1}</h4>`;
    block.steps.forEach((step, sIdx) => {
      const div = document.createElement("div");
      div.className = "step";
      div.textContent = `${bIdx + 1}.${sIdx + 1}: ${step.name || "Unnamed Step"}`;
      blockDiv.appendChild(div);
    });
    stepList.appendChild(blockDiv);
  });
}

export function initializeScenarioManager() {
  console.log("🧠 Initializing ScenarioManager");
  updateBlockSelector();
  renderCurrentScenario();
}

function splitByComma(id) {
  const value = document.getElementById(id)?.value || "";
  return value.split(",").map(x => x.trim()).filter(x => x);
}
