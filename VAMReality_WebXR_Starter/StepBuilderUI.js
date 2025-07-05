
import { addStep, saveStep, addCondition, saveConditions, renderCurrentScenario } from './ScenarioManager.js';

export function initializeStepBuilder() {
  console.log("🛠️ Initializing StepBuilder...");

  const mapClick = (id, handler, label) => {
    const el = document.getElementById(id);
    if (el) {
      el.onclick = handler;
      console.log(`✅ Bound: ${label}`);
    } else {
      console.warn(`⚠️ Not found: ${label}`);
    }
  };

  mapClick("addStep", addStep, "Add Step");
  mapClick("saveStep", saveStep, "Save Step");
  mapClick("addCondition", addCondition, "Add Condition");
  mapClick("saveConditions", saveConditions, "Save Conditions");


  const addBtn = document.getElementById("addCondition");
  const saveBtn = document.getElementById("saveConditions");

  const inputs = {
    label: document.getElementById("conditionLabel"),
    block: document.getElementById("conditionBlockSelect"),
    step: document.getElementById("conditionStepSelect")
  };

  const enableInputs = (enabled) => {
    inputs.label.disabled = !enabled;
    inputs.block.disabled = !enabled;
    inputs.step.disabled = !enabled;
    saveBtn.disabled = !enabled;
  };

  // Initial disable
  enableInputs(false);

  addBtn.onclick = () => {
    // Clear fields
    inputs.label.value = "";
    inputs.block.innerHTML = "";
    inputs.step.innerHTML = "";

    // Enable fields
    enableInputs(true);

    // Populate block and step lists
    const scenario = window.scenarioStore?.current;
    if (!scenario?.blocks?.length) return;

    scenario.blocks.forEach((block, bIdx) => {
      const opt = document.createElement("option");
      opt.value = bIdx;
      opt.text = "Block " + (bIdx + 1);
      inputs.block.appendChild(opt);
    });

    const updateStepOptions = () => {
      const blockIndex = parseInt(inputs.block.value);
      inputs.step.innerHTML = "";
      scenario.blocks[blockIndex]?.steps?.forEach((step, sIdx) => {
        const opt = document.createElement("option");
        opt.value = sIdx;
        opt.text = (sIdx + 1) + ". " + (step.name || "Unnamed Step");
        inputs.step.appendChild(opt);
      });
    };

    inputs.block.onchange = updateStepOptions;
    updateStepOptions();
  };

  saveBtn.onclick = () => {
    const label = inputs.label.value.trim();
    const targetBlock = parseInt(inputs.block.value);
    const targetStep = parseInt(inputs.step.value);
  
    if (!label || isNaN(targetBlock) || isNaN(targetStep)) {
      alert("Please complete the condition fields.");
      return;
    }
  
    const scenario = window.scenarioStore?.current;
    if (!scenario) return alert("⚠️ No scenario loaded.");
  
    const step = window.selectedStep
      ? scenario.blocks[window.selectedStep.block]?.steps[window.selectedStep.step]
      : scenario.blocks.at(-1)?.steps.at(-1);
  
    if (!step) {
      alert("❌ No valid step found to attach the condition to.");
      return;
    }
  
    // Add the condition
    step.conditions = step.conditions || [];
    step.conditions.push({ label, target: { block: targetBlock, step: targetStep } });
  
    // Update UI + graph
    updateConditionList(step);
    renderCurrentScenario();
    drawScenarioGraph();
  
    alert("✅ Condition added to step.");
  
    // Reset input state
    enableInputs(false);
  };

  
}
