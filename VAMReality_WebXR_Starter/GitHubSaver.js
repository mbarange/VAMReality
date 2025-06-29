
const scenarioStore = window.scenarioStore;
const renderCurrentScenario = window.renderCurrentScenario;

window.saveToGitHub = async function () {
  const user = document.getElementById("githubUser").value.trim();
  const repo = document.getElementById("githubRepo").value.trim();
  const token = document.getElementById("githubToken").value.trim();
  const folder = document.getElementById("githubFolder").value.trim();
  const scenario = scenarioStore.current;

  if (!user || !repo || !token || !scenario) {
    alert("Please fill in GitHub credentials and select a scenario.");
    return;
  }
  
  const path = folder ? `${folder}/${scenario.name}.json` : `${scenario.name}.json`;
  const apiUrl = \`https://api.github.com/repos/\${user}/\${repo}/contents/\${path}\`;

  try {
    const check = await fetch(apiUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(scenario, null, 2))));
    let method = "PUT";
    let body = {
      message: "Save scenario update",
      content,
      branch: "main"
    };

    if (check.ok) {
      const existing = await check.json();
      body.sha = existing.sha;
    }

    const upload = await fetch(apiUrl, {
      method,
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify(body)
    });

    if (upload.ok) {
      alert("✅ Scenario saved to GitHub.");
    } else {
      const error = await upload.json();
      alert("❌ Save failed: " + error.message);
    }
  } catch (e) {
    alert("❌ Error: " + e.message);
  }
};

window.loadFromGitHub = async function () {
  const user = document.getElementById("githubUser").value.trim();
  const repo = document.getElementById("githubRepo").value.trim();
  const token = document.getElementById("githubToken").value.trim();
  const folder = document.getElementById("githubFolder").value.trim();
  const listEl = document.getElementById("scenarioList");

  if (!user || !repo || !token) {
    alert("Please fill in GitHub info.");
    return;
  }

  const dirUrl = folder
    ? \`https://api.github.com/repos/\${user}/\${repo}/contents/\${folder}\`
    : \`https://api.github.com/repos/\${user}/\${repo}/contents\`;

  try {
    const res = await fetch(dirUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) throw new Error("Could not access GitHub directory.");

    const files = await res.json();
    const scenarios = files.filter(f => f.name.endsWith(".json"));

    listEl.innerHTML = "";
    for (const f of scenarios) {
      const opt = document.createElement("option");
      opt.value = f.name.replace(".json", "");
      opt.textContent = opt.value;
      listEl.appendChild(opt);
    }

    if (scenarios.length > 0) {
      alert("✅ Scenario list loaded. Now select and click 'Load'.");
    } else {
      alert("⚠️ No scenario files found.");
    }
  } catch (e) {
    alert("❌ Load failed: " + e.message);
  }
};

window.loadSelectedScenario = async function () {
  const name = document.getElementById("scenarioList").value;
  const user = document.getElementById("githubUser").value.trim();
  const repo = document.getElementById("githubRepo").value.trim();
  const token = document.getElementById("githubToken").value.trim();
  const folder = document.getElementById("githubFolder").value.trim();

  if (!name || !user || !repo || !token) {
    alert("Missing information to load scenario.");
    return;
  }

  const path = folder ? \`\${folder}/\${name}.json\` : \`\${name}.json\`;
  const fileUrl = \`https://api.github.com/repos/\${user}/\${repo}/contents/\${path}\`;

  try {
    const res = await fetch(fileUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) throw new Error("Scenario not found.");

    const file = await res.json();
    const decoded = JSON.parse(decodeURIComponent(escape(atob(file.content))));

    scenarioStore.scenarios[decoded.name] = decoded;
    scenarioStore.current = decoded;

    alert("✅ Scenario loaded!");
    window.updateBlockSelector();
    renderCurrentScenario();
  } catch (e) {
    alert("❌ Load failed: " + e.message);
  }
};
