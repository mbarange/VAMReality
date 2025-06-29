
window.runScenario = function () {
  const current = window.scenarioStore.current;
  if (!current) return alert("No scenario selected.");
  const steps = [];

  current.blocks.forEach((block, b) => {
    block.steps.forEach((s, i) => {
      steps.push({ ...s, label: `${b + 1}.${i + 1}`, blockIndex: b, stepIndex: i });
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

    if (step.conditions && step.conditions.length) {
      const form = document.createElement("form");
      form.innerHTML = "<strong>Choose:</strong><br/>";

      step.conditions.forEach((c, idx) => {
        const rb = document.createElement("input");
        rb.type = "radio";
        rb.name = "stepCond";
        rb.id = "cond" + idx;
        rb.value = c.target;

        const label = document.createElement("label");
        label.htmlFor = "cond" + idx;
        label.innerText = `${c.label} → Step ${c.target}`;

        form.appendChild(rb);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
      });

      const goBtn = document.createElement("button");
      goBtn.textContent = "Go";
      goBtn.type = "button";
      goBtn.onclick = () => {
        const selected = form.querySelector("input[name='stepCond']:checked");
        if (!selected) return alert("Choose an option.");
        const match = steps.find(s => s.label === selected.value);
        if (match) {
          currentIndex = steps.indexOf(match);
          renderStep();
        }
      };
      form.appendChild(goBtn);
      display.appendChild(form);
    } else {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next";
      nextBtn.onclick = () => {
        currentIndex++;
        renderStep();
      };
      nav.appendChild(nextBtn);
      display.appendChild(nav);
    }
  }

  renderStep();
};
