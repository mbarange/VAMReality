
import { addStep, saveStep, addCondition, saveConditions } from './ScenarioManager.js';

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
}
