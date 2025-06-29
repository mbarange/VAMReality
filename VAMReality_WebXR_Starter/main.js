
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

// Placeholder to ensure scenarioStore is defined for testing
window.scenarioStore = window.scenarioStore || {
  current: {
    name: "Example Scenario",
    blocks: [
      {
        steps: [
          { name: "Step A", instructionText: "Instruction for Step A" },
          { name: "Step B", instructionText: "Instruction for Step B" }
        ]
      }
    ]
  }
};
