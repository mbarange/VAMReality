
export const scenarioStore = {
  scenarios: {},
  current: null,
  currentBlockId: null
};

export function initializeScenarioManager() {
  const selector = document.getElementById("scenarioList");
  updateScenarioDropdown();

  window.createScenario = () => {
    const name = document.getElementById("newScenarioName").value.trim();
    if (!name || scenarioStore.scenarios[name]) return;
    scenarioStore.scenarios[name] = { name, blocks: [] };
    scenarioStore.current = scenarioStore.scenarios[name];
    updateScenarioDropdown();
    renderCurrentScenario();
    updateBlockSelector();
  };

  window.loadSelectedScenario = () => {
    const selected = selector.value;
    if (scenarioStore.scenarios[selected]) {
      scenarioStore.current = scenarioStore.scenarios[selected];
      renderCurrentScenario();
      updateBlockSelector();
    }
  };

  window.createBlock = () => {
    if (!scenarioStore.current) return;
    const nextBlockId = scenarioStore.current.blocks.length + 1;
    scenarioStore.current.blocks.push({ blockId: nextBlockId, steps: [] });
    scenarioStore.currentBlockId = nextBlockId;
    updateBlockSelector();
    renderCurrentScenario();
  };

  window.updateBlockSelector = updateBlockSelector;
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

function updateBlockSelector() {
  const select = document.getElementById("blockSelector");
  select.innerHTML = "";
  if (!scenarioStore.current || !scenarioStore.current.blocks) return;
  scenarioStore.current.blocks.forEach(block => {
    const opt = document.createElement("option");
    opt.value = block.blockId;
    opt.textContent = "Block " + block.blockId;
    select.appendChild(opt);
  });
  select.onchange = () => {
    scenarioStore.currentBlockId = parseInt(select.value);
    renderCurrentScenario();
  };
  if (select.options.length > 0) {
    select.value = scenarioStore.currentBlockId || select.options[0].value;
    scenarioStore.currentBlockId = parseInt(select.value);
  }
}

export function renderCurrentScenario() {
  const list = document.getElementById("stepList");
  const flow = document.getElementById("flowBlocks");
  list.innerHTML = "";
  flow.innerHTML = "";

  const scenario = scenarioStore.current;
  if (!scenario || !scenario.blocks) return;

  scenario.blocks.forEach(block => {
    const blockTitle = document.createElement("div");
    blockTitle.innerHTML = `<h4>Block ${block.blockId}</h4>`;
    list.appendChild(blockTitle);
    flow.appendChild(blockTitle.cloneNode(true));

    block.steps.forEach((step, idx) => {
      const fullId = `${block.blockId}.${idx + 1}`;
      const div = document.createElement("div");
      div.className = "step-block";
      div.innerHTML = `<strong>${fullId} - ${step.name}</strong><br>${step.instructionText}`;
      div.onclick = () => window.editStep(block.blockId, idx);
      list.appendChild(div);

      const flowDiv = document.createElement("div");
      flowDiv.className = "flow-block";
      flowDiv.innerHTML = `
        <strong>${fullId}. ${step.name}</strong><br>
        <small>${step.instructionText}</small><br>
        <em>🖼️ ${step.images.length} | 📹 ${step.videos.length} | 📄 ${step.pdfs.length} | 🧱 ${step.models.length}</em>
      `;
      flow.appendChild(flowDiv);
    });
  });
}
