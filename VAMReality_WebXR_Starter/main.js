
import { initializeScenarioManager } from './ScenarioManager.js';
import { initializeStepBuilder } from './StepBuilderUI.js';

window.onload = () => {
  initializeScenarioManager();
  initializeStepBuilder();
};
