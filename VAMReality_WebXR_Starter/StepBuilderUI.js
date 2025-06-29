
import { addStep, saveStep, addCondition, saveConditions } from './ScenarioManager.js';

export function initializeStepBuilder() {
  const addStepBtn = document.getElementById("addStep");
  if (addStepBtn) addStepBtn.onclick = addStep;

  const saveStepBtn = document.getElementById("saveStep");
  if (saveStepBtn) saveStepBtn.onclick = saveStep;

  const addCondBtn = document.getElementById("addCondition");
  if (addCondBtn) addCondBtn.onclick = addCondition;

  const saveCondBtn = document.getElementById("saveConditions");
  if (saveCondBtn) saveCondBtn.onclick = saveConditions;
}
