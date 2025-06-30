
export function addStep() {
  console.log("➕ addStep called");
}

export function saveStep() {
  console.log("💾 saveStep called");
}

export function addCondition() {
  console.log("📎 addCondition called");
}

export function saveConditions() {
  console.log("✅ saveConditions called");
}

export function createScenario() {
  console.log("📘 createScenario called");
}

export function loadSelectedScenario() {
  console.log("📂 loadSelectedScenario called");
}

export function addBlock() {
  console.log("🧱 addBlock called");
}

export function initializeScenarioManager() {
  console.log("🧠 ScenarioManager initialized.");
}

export const scenarioStore = {
  current: null,
  all: []
}