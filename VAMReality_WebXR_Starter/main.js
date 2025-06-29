
window.scenarioStore = window.scenarioStore || { scenarios: {}, current: null };

window.createScenario = function () {
  const name = document.getElementById("newScenarioName").value.trim();
  if (!name) return alert("Please enter a scenario name.");

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
  const current = window.scenarioStore.current;
  const selector = document.getElementById("blockSelector");
  selector.innerHTML = "";
  current.blocks.forEach((block, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = "Block " + (i + 1);
    selector.appendChild(opt);
  });
};

window.addBlock = function () {
  const current = window.scenarioStore.current;
  if (!current) return alert("No scenario selected.");
  current.blocks.push({ steps: [] });
  window.updateBlockSelector();
};

window.addStep = function () {
  const current = window.scenarioStore.current;
  const blockIndex = document.getElementById("blockSelector").value;
  if (!current || !current.blocks[blockIndex]) return alert("Select a valid block.");

  const step = {
    name: document.getElementById("stepName").value,
    instructionText: document.getElementById("stepInstruction").value,
    voiceCommand: document.getElementById("stepVoice").value,
    stepType: document.getElementById("stepType").value,
    instructionKeyTextPoints: document.getElementById("stepKeyPoints").value.split(",").map(s => s.trim()).filter(Boolean),
    instructionImages: document.getElementById("stepImages").value.split(",").map(s => s.trim()).filter(Boolean),
    instructionVideos: document.getElementById("stepVideos").value.split(",").map(s => s.trim()).filter(Boolean),
    instructionPDFPaths: document.getElementById("stepPDFs").value.split(",").map(s => s.trim()).filter(Boolean),
    instructionModels: document.getElementById("stepModels").value.split(",").map(s => s.trim()).filter(Boolean),
    POIReferencePoints: document.getElementById("stepPOIRefs").value.split(",").map(s => s.trim()).filter(Boolean),
    conditions: [],
    resourcePlacements: []
  };

  current.blocks[blockIndex].steps.push(step);
  alert("✅ Step added.");
};

window.saveCurrentStep = function () {
  alert("✅ Step saved (persisted in memory).");
};

window.addCondition = function () {
  const current = window.scenarioStore.current;
  const blockIndex = document.getElementById("blockSelector").value;
  if (!current || !current.blocks[blockIndex]) return alert("Invalid block.");

  const block = current.blocks[blockIndex];
  const step = block.steps[block.length - 1];
  if (!step) return alert("No step to add condition to.");

  const label = document.getElementById("conditionLabel").value;
  const target = document.getElementById("targetStep").value;
  if (!label || !target) return alert("Fill condition and target.");

  step.conditions = step.conditions || [];
  step.conditions.push({ label: label, target: target });
  alert("✅ Condition added.");
};

window.saveConditions = function () {
  alert("✅ Conditions saved.");
};

window.runScenario = function () {
  const current = window.scenarioStore.current;
  if (!current) return alert("No scenario selected.");
  const steps = [];

  current.blocks.forEach((block, b) => {
    block.steps.forEach((s, i) => {
      steps.push({ ...s, label: `${b + 1}.${i + 1}` });
    });
  });

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
