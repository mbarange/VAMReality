
export const scenarioStore = {
  scenarios: {},
  current: null
};

export function initializeScenarioManager() {
  const selector = document.getElementById("scenarioList");
  updateScenarioDropdown();

  window.createScenario = () => {
    const name = document.getElementById("newScenarioName").value.trim();
    if (!name || scenarioStore.scenarios[name]) return;
    scenarioStore.scenarios[name] = { name, steps: [] };
    scenarioStore.current = scenarioStore.scenarios[name];
    updateScenarioDropdown();
    renderCurrentScenario();
  };

  window.loadSelectedScenario = () => {
    const selected = selector.value;
    if (scenarioStore.scenarios[selected]) {
      scenarioStore.current = scenarioStore.scenarios[selected];
      renderCurrentScenario();
    }
  };
}

function updateScenarioDropdown() {
  const selector = document.getElementById("scenarioList");
  selector.innerHTML = "";
  for (const name in scenarioStore.scenarios) {
    const option = document.createElement("option");
    option.value = option.textContent = name;
    selector.appendChild(option);
  }
}

export function renderCurrentScenario() {
  const list = document.getElementById("stepList");
  list.innerHTML = "";
  const flow = document.getElementById("flowBlocks");
  flow.innerHTML = "";

  const scenario = scenarioStore.current;
  if (!scenario) return;

  scenario.steps.forEach((step, i) => {
    const div = document.createElement("div");
    div.className = "step-block";
    div.innerText = step;
    list.appendChild(div);

    const flowDiv = document.createElement("div");
    flowDiv.className = "flow-block";
    flowDiv.innerText = `Step ${i + 1}: ${step}`;
    flow.appendChild(flowDiv);
  });
}
