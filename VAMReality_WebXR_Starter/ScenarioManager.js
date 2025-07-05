import { drawScenarioGraph } from "./FlowRenderer.js";
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

  updateScenarioList();
  document.getElementById("scenarioList").value = scenario.name;

  updateBlockSelector();
  renderCurrentScenario();
  drawScenarioGraph();
  alert("✅ Scenario created: " + name);
}

export function loadSelectedScenario() {
  const select = document.getElementById("scenarioList");
  const url = select.value;
  if (!url) return alert("No scenario selected.");
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      const newScenario = structuredClone(data);
      scenarioStore.current = newScenario;
      const found = scenarioStore.all.find(s => s.name === newScenario.name);
      if (!found) scenarioStore.all.push(newScenario);
      updateBlockSelector();
      renderCurrentScenario();
      drawScenarioGraph();
    })
    .catch((e) => alert("❌ Failed to load scenario: " + e.message));
}

export function addBlock() {
  if (!scenarioStore.current) return alert("No scenario selected.");
  const newBlock = { id: scenarioStore.current.blocks.length + 1, steps: [] };
  scenarioStore.current.blocks.push(newBlock);
  updateBlockSelector();
  renderCurrentScenario();
  drawScenarioGraph();
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
  addStepCondition(step);
  block.steps.push(step);  
  renderCurrentScenario();
  clearStepEditorFields();
  drawScenarioGraph();
}

export function saveStep() {
  const sel = window.selectedStep;
  if (!sel) return alert("❗No step selected");
  const step = scenarioStore.current.blocks[sel.block].steps[sel.step];
  step.name = getVal("stepName");
  step.type = getVal("stepType");
  step.instructionText = getVal("stepInstruction");
  step.voiceCommand = getVal("stepVoice");
  step.instructionKeyTextPoints = split("stepKeyPoints");
  step.instructionImages = split("stepImages");
  step.instructionVideos = split("stepVideos");
  step.instructionPDFPaths = split("stepPDFs");
  step.instructionModels = split("stepModels");
  step.POIReferencePoints = split("stepPOIRefs");
  renderCurrentScenario();
  clearStepEditorFields();
  drawScenarioGraph();
}

export function addStepCondition(step) {
  console.log("adding condition to step");
  const blockIdx = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[blockIdx];
   if (!step) return alert("No step to add condition.");

  const label = getVal("conditionLabel");
  console.log(label );
  if(label!=""){
      const targetBlock = parseInt(getVal("conditionBlockSelect"));
      const targetStep = parseInt(getVal("conditionStepSelect"));
      if (!label) return alert("Enter a condition label.");

      if (!step.conditions) step.conditions = [];
      step.conditions.push({ label, target: { block: targetBlock, step: targetStep } });
      updateConditionList(step); // 👈 this line must be here
      const condList = document.getElementById("conditionList");
      condList.innerHTML = "";
        step.conditions.forEach((cond, i) => {
          const li = document.createElement("li");
          li.textContent = `→ ${cond.label || "Condition"}: Block ${cond.target.block + 1}, Step ${cond.target.step + 1}`;
          condList.appendChild(li);
        });   
  }
  drawScenarioGraph();
}

export function addCondition() {
  const blockIdx = parseInt(document.getElementById("blockSelector").value);
  const block = scenarioStore.current?.blocks?.[blockIdx];

  const sel = window.selectedStep;
  if (!sel || sel.block !== blockIdx) return alert("❗Select a step in this block to add a condition.");

  const step = scenarioStore.current.blocks[sel.block].steps[sel.step];
  if (!step) return alert("❗No step selected.");


  const label = getVal("conditionLabel");
  const targetBlock = parseInt(getVal("conditionBlockSelect"));
  const targetStep = parseInt(getVal("conditionStepSelect"));
  if (!label) return alert("Enter a condition label.");

  if (!step.conditions) step.conditions = [];
  step.conditions.push({ label, target: { block: targetBlock, step: targetStep } });
  updateConditionList(step); // 👈 this line must be here
  renderCurrentScenario();
  drawScenarioGraph();
}

export function saveConditions() {
  alert("Conditions saved.");
}

export function updateScenarioList() {
  const list = document.getElementById("scenarioList");
  if (!list) return;
  list.innerHTML = "";
  scenarioStore.all.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s.name;
    opt.value = s.name;
    list.appendChild(opt);
  });

  if (scenarioStore.current) {
    list.value = scenarioStore.current.name;
  }

  drawScenarioGraph();
}

export function updateBlockSelector() {
  const selector = document.getElementById("blockSelector");
  if (!selector || !scenarioStore.current?.blocks) return;

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
      el.onclick = () => {
        window.selectedStep = { block: bIdx, step: sIdx };
        const step = scenarioStore.current.blocks[bIdx].steps[sIdx];
      
        document.getElementById("stepName").value = step.name || "";
        document.getElementById("stepType").value = step.type || "";
        document.getElementById("stepInstruction").value = step.instructionText || "";
        document.getElementById("stepVoice").value = step.voiceCommand || "";
        document.getElementById("stepKeyPoints").value = (step.instructionKeyTextPoints || []).join(", ");
        document.getElementById("stepImages").value = (step.instructionImages || []).join(", ");
        document.getElementById("stepVideos").value = (step.instructionVideos || []).join(", ");
        document.getElementById("stepPDFs").value = (step.instructionPDFPaths || []).join(", ");
        document.getElementById("stepModels").value = (step.instructionModels || []).join(", ");
        document.getElementById("stepPOIRefs").value = (step.POIReferencePoints || []).join(", ");
        const condList = document.getElementById("conditionList");
        condList.innerHTML = "";
        
        updateConditionList(step);
        // Load first condition (if any)
        if (step.conditions && step.conditions.length > 0) {
          const cond = step.conditions[0];
          const target = cond?.target || {};
          const blockSel = document.getElementById("conditionBlockSelect");
          const stepSel = document.getElementById("conditionStepSelect");
          const labelInput = document.getElementById("conditionLabel");
        
          if (cond && cond.target && blockSel && stepSel && labelInput) {
            if (
              typeof cond.target.block === "number" &&
              typeof cond.target.step === "number"
            ) {
              blockSel.value = cond.target.block;
              blockSel.dispatchEvent(new Event("change"));
              setTimeout(() => {
                stepSel.value = cond.target.step;
                labelInput.value = cond.label || "";
              }, 100);
            } else {
              blockSel.selectedIndex = 0;
              stepSel.selectedIndex = 0;
              labelInput.value = "";
            }
          }
        } else {
          document.getElementById("conditionLabel").value = "";
        }      
        alert("✅ Selected: " + el.textContent);
      };
      div.appendChild(el);
    });
    list.appendChild(div);
  });

  drawScenarioGraph();
}

export function editSelectedStep() {
  const sel = window.selectedStep;
  if (!sel) return alert("❗No step selected");
  const step = scenarioStore.current.blocks[sel.block].steps[sel.step];
  document.getElementById("stepName").value = step.name;
  document.getElementById("stepType").value = step.type;
  document.getElementById("stepInstruction").value = step.instructionText;
  document.getElementById("stepVoice").value = step.voiceCommand;

  document.getElementById("stepKeyPoints").value = (step.instructionKeyTextPoints || []).join(", ");
  document.getElementById("stepImages").value = (step.instructionImages || []).join(", ");
  document.getElementById("stepVideos").value = (step.instructionVideos || []).join(", ");
  document.getElementById("stepPDFs").value = (step.instructionPDFPaths || []).join(", ");
  document.getElementById("stepModels").value = (step.instructionModels || []).join(", ");
  document.getElementById("stepPOIRefs").value = (step.POIReferencePoints || []).join(", ");

  if (step.conditions && step.conditions.length) {
    const blockSel = document.getElementById("conditionBlockSelect");
    const stepSel = document.getElementById("conditionStepSelect");
    if (blockSel && stepSel) {
      const last = step.conditions[step.conditions.length - 1];
      blockSel.value = last.target.block;
      blockSel.dispatchEvent(new Event("change"));
      setTimeout(() => {
        stepSel.value = last.target.step;
        document.getElementById("conditionLabel").value = last.label;
      }, 100);
    }
  }
}

export function deleteSelectedStep() {
  const sel = window.selectedStep;
  if (!sel) return alert("❗No step selected");
  const block = scenarioStore.current?.blocks?.[sel.block];
  if (!block || !block.steps?.[sel.step]) return;

  // Delete the selected step
  block.steps.splice(sel.step, 1);

  // Update all condition targets to shift down if they were after deleted step
  scenarioStore.current.blocks.forEach(b => {
    b.steps.forEach(s => {
      if (s.conditions) {
        s.conditions = s.conditions
          .filter(c => !(c.target.block === sel.block && c.target.step === sel.step))
          .map(c => {
            if (c.target.block === sel.block && c.target.step > sel.step) {
              c.target.step -= 1;
            }
            return c;
          });
      }
    });
  });

  // Clear selection
  window.selectedStep = null;

  // Re-render UI
  renderCurrentScenario();
  clearStepEditorFields();
  drawScenarioGraph();
}

function updateConditionList(step) {
  const condList = document.getElementById("conditionList");
  if (!condList) return;
  condList.innerHTML = "";

  step.conditions.forEach((cond, i) => {
    if (!cond || !cond.target || cond.target.block == null || cond.target.step == null) return;

    const label = cond.label || "Unnamed";
    const block = cond.target.block + 1;
    const stepNum = cond.target.step + 1;

    const li = document.createElement("li");
    li.innerHTML = `
      📌 ${label} → Block ${block}, Step ${stepNum}
      <button data-edit="${i}">✏</button>
      <button data-delete="${i}">🗑</button>
    `;
    condList.appendChild(li);
  });

  // Attach handlers after rendering
  condList.querySelectorAll("button[data-edit]").forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.edit);
      const cond = step.conditions[i];
      if (cond && cond.target) {
        document.getElementById("conditionBlockSelect").value = cond.target.block;
        document.getElementById("conditionBlockSelect").dispatchEvent(new Event("change"));
        setTimeout(() => {
          document.getElementById("conditionStepSelect").value = cond.target.step;
          document.getElementById("conditionLabel").value = cond.label || "";
        }, 100);
    
        // 👉 Make Save Condition editable
        document.getElementById("conditionLabel").disabled = false;
        document.getElementById("conditionBlockSelect").disabled = false;
        document.getElementById("conditionStepSelect").disabled = false;
        document.getElementById("saveConditions").disabled = false;
        enableConditionInputs(true); // reuse helper
    
        // 🔐 Track index
        window.editingConditionIndex = i;
      }
    };
  });

  condList.querySelectorAll("button[data-delete]").forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.delete);
      if (confirm("Delete this condition?")) {
        step.conditions.splice(i, 1);
        updateConditionList(step);
      }
    };
  });
}

export function initializeScenarioManager() {
  console.log("✅ Scenario Manager initialized");
  if (scenarioStore.current) {
    updateBlockSelector();
    renderCurrentScenario();
    drawScenarioGraph();
  }
}

function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function split(id) {
  return getVal(id).split(",").map(s => s.trim()).filter(Boolean);
}
function clearStepEditorFields() {
  console.log("✅ trying to clean fields");
  const fields = [
    "stepName", "stepType", "stepInstruction", "stepVoice",
    "stepKeyPoints", "stepImages", "stepVideos",
    "stepPDFs", "stepModels", "stepPOIRefs"
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.getElementById("conditionList").innerHTML = "";
}
window.scenarioStore = scenarioStore;