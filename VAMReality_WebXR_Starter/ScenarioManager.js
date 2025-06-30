
export const scenarioStore = {
  current: null,
  all: []
};
export function initializeScenarioManager() {
  const selector = document.getElementById("scenarioList");
  updateScenarioDropdown();

  window.createScenario = () => {
    const name = document.getElementById("newScenarioName").value.trim();
    if (!name || scenarioStore.scenarios[name]) return;
    scenarioStore.scenarios[name] = { name, blocks: [] };
    scenarioStore.current = scenarioStore.scenarios[name];
    updateScenarioDropdown();
    renderCurrentScenario();
    updateBlockSelector();
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
  console.log(" scenario created");
  alert("✅ Scenario created: " + name);
}

export function loadSelectedScenario() {
  const selector = document.getElementById("scenarioList");
  const selected = selector.value;
  if (!selected) return;

  fetch(selected)
    .then(res => res.json())
    .then(data => {
      scenarioStore.current = data;
      updateBlockSelector();
      renderCurrentScenario();
    })
    .catch(err => alert("❌ Failed to load scenario: " + err));
}

export function addBlock() {
  if (!scenarioStore.current) return alert("Please create or select a scenario.");
  const newBlock = { id: scenarioStore.current.blocks.length + 1, steps: [] };
  scenarioStore.current.blocks.push(newBlock);
  updateBlockSelector();
  renderCurrentScenario();
}

export function addStep() {
  if (!scenarioStore.current) return alert("Please create a scenario first.");
  const blockIndex = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current.blocks[blockIndex];
  if (!block) return alert("Please select a valid block.");

  const step = {
    name: document.getElementById("stepName").value.trim(),
    type: document.getElementById("stepType").value,
    instructionText: document.getElementById("stepInstruction").value.trim(),
    voiceCommand: document.getElementById("stepVoice").value.trim(),
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
  alert("💾 Step saved (placeholder)");
}

export function addCondition() {
  const blockIndex = parseInt(document.getElementById("conditionBlockSelect").value);
  const stepIndex = parseInt(document.getElementById("conditionStepSelect").value);
  const label = document.getElementById("conditionLabel").value;

  const target = { block: blockIndex, step: stepIndex };
  const blockSel = parseInt(document.getElementById("blockSelector").value);
  const stepList = scenarioStore.current.blocks[blockSel].steps;
  const currentStep = stepList[stepList.length - 1];
  if (!currentStep.conditions) currentStep.conditions = [];
  currentStep.conditions.push({ label, target });

  renderCurrentScenario();
}

export function saveConditions() {
  alert("✅ Conditions saved (placeholder)");
}

export function updateScenarioList() {
  const list = document.getElementById("scenarioList");
  const current = scenarioStore.current;
  const opt = document.createElement("option");
  opt.text = current.name;
  opt.value = current.name;
  list.appendChild(opt);
}

function splitByComma(id) {
  const val = document.getElementById(id).value.trim();
  return val ? val.split(",").map(x => x.trim()) : [];
}

export function updateBlockSelector() {
  const sel = document.getElementById("blockSelector");
  sel.innerHTML = "";
  scenarioStore.current.blocks.forEach((block, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = "Block " + (i + 1);
    sel.appendChild(opt);
  });
}

export function renderCurrentScenario() {
  const stepList = document.getElementById("stepList");
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
