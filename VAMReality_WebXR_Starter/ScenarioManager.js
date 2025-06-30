
export const scenarioStore = {
  current: null,
  all: []
};

export function createScenario() {
  const name = document.getElementById("newScenarioName").value.trim();
  if (!name) return alert("Please enter a scenario name.");

  const scenario = { name, blocks: [] };
  scenarioStore.current = scenario;
  scenarioStore.all.push(scenario);

  updateScenarioList(); // ⬅️ Ensures <option> is added first
  document.getElementById("scenarioList").value = scenario.name;

  updateBlockSelector();
  renderCurrentScenario();

  alert("✅ Scenario created: " + name);
}

export function selectStepForEditing(blockIndex, stepIndex) {
  const step = scenarioStore.current.blocks[blockIndex].steps[stepIndex];
  document.getElementById("stepName").value = step.name;
  document.getElementById("stepType").value = step.type;
  document.getElementById("stepInstruction").value = step.instructionText;
  document.getElementById("stepVoice").value = step.voiceCommand;
  document.getElementById("stepKeyPoints").value = step.instructionKeyTextPoints.join(", ");
  document.getElementById("stepImages").value = step.instructionImages.join(", ");
  document.getElementById("stepVideos").value = step.instructionVideos.join(", ");
  document.getElementById("stepPDFs").value = step.instructionPDFPaths.join(", ");
  document.getElementById("stepModels").value = step.instructionModels.join(", ");
  document.getElementById("stepPOIRefs").value = step.POIReferencePoints.join(", ");
}

export function deleteStep(blockIndex, stepIndex) {
  const block = scenarioStore.current.blocks[blockIndex];
  if (!block || !block.steps[stepIndex]) return;

  block.steps.splice(stepIndex, 1);

  scenarioStore.current.blocks.forEach((b) => {
    b.steps.forEach((s) => {
      if (s.conditions) {
        s.conditions = s.conditions.filter(
          (c) => !(c.target.block === blockIndex && c.target.step === stepIndex)
        );
      }
    });
  });

  renderCurrentScenario();
}

export function editSelectedStep() {
  const sel = window.selectedStep;
  if (!sel) return alert("❗No step selected");
  const step = scenarioStore.current.blocks[sel.block].steps[sel.step];
  document.getElementById("stepName").value = step.name;
  document.getElementById("stepType").value = step.type;
  document.getElementById("stepInstruction").value = step.instructionText;
  document.getElementById("stepVoice").value = step.voiceCommand;
  document.getElementById("stepKeyPoints").value = step.instructionKeyTextPoints.join(", ");
  document.getElementById("stepImages").value = step.instructionImages.join(", ");
  document.getElementById("stepVideos").value = step.instructionVideos.join(", ");
  document.getElementById("stepPDFs").value = step.instructionPDFPaths.join(", ");
  document.getElementById("stepModels").value = step.instructionModels.join(", ");
  document.getElementById("stepPOIRefs").value = step.POIReferencePoints.join(", ");
}


export function deleteSelectedStep() {
  const sel = window.selectedStep;
  if (!sel) return alert("❗No step selected");
  const block = scenarioStore.current.blocks[sel.block];
  if (!block || !block.steps[sel.step]) return;

  block.steps.splice(sel.step, 1);

  // Remove conditions pointing to this step
  scenarioStore.current.blocks.forEach(b => {
    b.steps.forEach(s => {
      if (s.conditions) {
        s.conditions = s.conditions.filter(c =>
          !(c.target.block === sel.block && c.target.step === sel.step)
        );
      }
    });
  });

  window.selectedStep = null;
  renderCurrentScenario();
}

export function loadSelectedScenario() {
  const select = document.getElementById("scenarioList");
  const url = select.value;
  if (!url) return alert("No scenario selected.");
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      scenarioStore.current = data;
      updateBlockSelector();
      renderCurrentScenario();
    })
    .catch((e) => alert("❌ Failed to load scenario: " + e.message));
}

export function addBlock() {
  if (!scenarioStore.current) return alert("No scenario selected.");
  const newBlock = { id: scenarioStore.current.blocks.length + 1, steps: [] };
  scenarioStore.current.blocks.push(newBlock);
  updateBlockSelector();
  renderCurrentScenario();
}

export function addStep() {
  const idx = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[idx];
  if (!block) return alert("Select a valid block.");
  const step = {
    name: getVal("stepName"),
    type: getVal("stepType"),
    instructionText: getVal("stepInstruction"),
    voiceCommand: getVal("stepVoice"),
    instructionKeyTextPoints: split("stepKeyPoints"),
    instructionImages: split("stepImages"),
    instructionVideos: split("stepVideos"),
    instructionPDFPaths: split("stepPDFs"),
    instructionModels: split("stepModels"),
    POIReferencePoints: split("stepPOIRefs"),
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
  const blockIdx = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[blockIdx];
  const step = block?.steps?.at(-1);
  if (!step) return alert("No step to add condition.");

  const label = getVal("conditionLabel");
  const targetBlock = parseInt(getVal("conditionBlockSelect"));
  const targetStep = parseInt(getVal("conditionStepSelect"));
  if (!label) return alert("Enter a condition label.");

  if (!step.conditions) step.conditions = [];
  step.conditions.push({ label, target: { block: targetBlock, step: targetStep } });
  renderCurrentScenario();
}

export function saveConditions() {
  alert("Conditions saved (placeholder)");
}

export function updateScenarioList() {
  const list = document.getElementById("scenarioList");
  const opt = document.createElement("option");
  opt.text = scenarioStore.current.name;
  opt.value = scenarioStore.current.name;
  if (![...list.options].some(o => o.value === opt.value)) {
    list.appendChild(opt);
  }
}

export function updateBlockSelector() {
  const selector = document.getElementById("blockSelector");
  if (!selector || !scenarioStore.current || !scenarioStore.current.blocks) return;

  selector.innerHTML = "";
  scenarioStore.current.blocks.forEach((block, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = "Block " + (i + 1);
    selector.appendChild(opt);
  });

  const conditionBlock = document.getElementById("conditionBlockSelect");
  const conditionStep = document.getElementById("conditionStepSelect");

  if (conditionBlock && conditionStep) {
    conditionBlock.innerHTML = "";
    conditionStep.innerHTML = "";

    scenarioStore.current.blocks.forEach((block, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.text = "Block " + (i + 1);
      conditionBlock.appendChild(opt);
    });

    conditionBlock.onchange = () => {
      const steps = scenarioStore.current?.blocks?.[conditionBlock.value]?.steps || [];
      conditionStep.innerHTML = "";
      steps.forEach((step, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = (i + 1) + ": " + (step.name || "Unnamed Step");
        conditionStep.appendChild(opt);
      });
    };

    if (scenarioStore.current.blocks.length > 0) {
      conditionBlock.dispatchEvent(new Event("change"));
    }
  }
}

export function renderCurrentScenario() {
  const list = document.getElementById("stepList");
  if (!list) return;
  list.innerHTML = "";
  scenarioStore.current?.blocks?.forEach((block, bIdx) => {
    const div = document.createElement("div");
    div.className = "block";
    div.innerHTML = `<h4>Block ${bIdx + 1}</h4>`;
    block.steps.forEach((step, sIdx) => {
      const el = document.createElement("div");
      el.className = "step";
      el.textContent = `${bIdx + 1}.${sIdx + 1}: ${step.name || "Unnamed Step"}`;
      div.appendChild(el);
    });
    list.appendChild(div);
  });
}

export function initializeScenarioManager() {
  console.log("✅ Scenario Manager initialized");
  if (!window.scenarioStore) window.scenarioStore = scenarioStore;
  if (scenarioStore.current) {
    updateBlockSelector();
    renderCurrentScenario();
  }
}

// Utility
function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "";
}
function split(id) {
  return getVal(id).split(",").map(s => s.trim()).filter(Boolean);
}
window.scenarioStore = scenarioStore;