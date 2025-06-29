
import { addStep, saveStep, addCondition, saveConditions } from './ScenarioManager.js';

export function initializeStepBuilder() {
  console.log("🔧 Initializing StepBuilder...");

  const addStepBtn = document.getElementById("addStep");
  if (addStepBtn) {
    addStepBtn.onclick = addStep;
    console.log("✅ addStep button found and bound.");
  } else {
    console.warn("❌ addStep button NOT found.");
  }

  const saveStepBtn = document.getElementById("saveStep");
  if (saveStepBtn) {
    saveStepBtn.onclick = saveStep;
    console.log("✅ saveStep button found and bound.");
  } else {
    console.warn("❌ saveStep button NOT found.");
  }

  const addCondBtn = document.getElementById("addCondition");
  if (addCondBtn) {
    addCondBtn.onclick = addCondition;
    console.log("✅ addCondition button found and bound.");
  } else {
    console.warn("❌ addCondition button NOT found.");
  }

  const saveCondBtn = document.getElementById("saveConditions");
  if (saveCondBtn) {
    saveCondBtn.onclick = saveConditions;
    console.log("✅ saveConditions button found and bound.");
  } else {
    console.warn("❌ saveConditions button NOT found.");
  }

  console.log("✅ StepBuilder initialization complete.");
}
