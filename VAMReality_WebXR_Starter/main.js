
window.runScenario = function () {
  const scenarioStore = window.scenarioStore;
  if (!scenarioStore || !scenarioStore.current) {
    alert("No scenario selected.");
    return;
  }

  const current = scenarioStore.current;
  const steps = [];

  for (let b = 0; b < current.blocks.length; b++) {
    const block = current.blocks[b];
    for (let s = 0; s < block.steps.length; s++) {
      steps.push({ ...block.steps[s], label: (b + 1) + '.' + (s + 1) });
    }
  }

  let currentIndex = 0;
  const display = document.getElementById("stepDisplay");

  function renderStep() {
    if (currentIndex >= steps.length) {
      display.innerHTML = "<b>✅ Scenario complete.</b>";
      return;
    }

    const step = steps[currentIndex];
    display.innerHTML = "<h3>Step " + step.label + ": " + step.name + "</h3><p>" + step.instructionText + "</p>";

    const nav = document.createElement("div");
    nav.style.marginTop = "1rem";

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      currentIndex++;
      renderStep();
    };

    nav.appendChild(nextBtn);
    display.appendChild(nav);
  }

  renderStep();
};

window.createScenario = function () {
  const name = document.getElementById("newScenarioName").value.trim();
  if (!name) {
    alert("Please enter a scenario name.");
    return;
  }

  if (!window.scenarioStore) window.scenarioStore = { scenarios: {} };
  if (!window.scenarioStore.scenarios[name]) {
    window.scenarioStore.scenarios[name] = {
      name: name,
      blocks: []
    };
  }

  window.scenarioStore.current = window.scenarioStore.scenarios[name];
  window.updateBlockSelector();
  alert("✅ Scenario '" + name + "' created and selected.");
};

window.updateBlockSelector = function () {
  const current = window.scenarioStore?.current;
  if (!current) return;

  const blockSelector = document.getElementById("blockSelector");
  if (!blockSelector) return;

  blockSelector.innerHTML = "";
  current.blocks.forEach(function (block, index) {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = "Block " + (index + 1);
    blockSelector.appendChild(opt);
  });
};

// Optional mock scenarioStore to test flow
window.scenarioStore = window.scenarioStore || {
  scenarios: {},
  current: null
};
