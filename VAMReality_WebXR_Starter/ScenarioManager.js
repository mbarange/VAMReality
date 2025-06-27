
export class ScenarioManager {
  constructor() {
    this.scenarios = {}; // scenarioName => ScenarioData
    this.currentName = "";
  }

  createScenario(name) {
    this.currentName = name;
    this.scenarios[name] = {
      scenarioName: name,
      steps: []
    };
  }

  loadScenario(name) {
    this.currentName = name;
  }

  addStep(step) {
    if (!this.currentName || !this.scenarios[this.currentName]) return;
    this.scenarios[this.currentName].steps.push(step);
  }

  getCurrentScenario() {
    return this.scenarios[this.currentName] || { steps: [] };
  }

  toJSON() {
    return JSON.stringify(this.getCurrentScenario(), null, 2);
  }

  getScenarioNames() {
    return Object.keys(this.scenarios);
  }
}
