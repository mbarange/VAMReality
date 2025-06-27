
export class ScenarioManager {
  constructor() {
    this.steps = [];
  }

  addStep(step) {
    this.steps.push(step);
  }

  toJSON() {
    return JSON.stringify({ steps: this.steps }, null, 2);
  }
}
