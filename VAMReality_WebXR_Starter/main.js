
import { initializeStepBuilder } from './StepBuilderUI.js';
import { initializeScenarioManager } from './ScenarioManager.js';

window.onload = () => {
  initializeScenarioManager();
  initializeStepBuilder();
};
