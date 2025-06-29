
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

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

  const path = folder ? \`\${folder}/\${scenario.name}.json\` : \`\${scenario.name}.json\`;
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
  const name = prompt("Enter the scenario name to load (without .json):");

  if (!user || !repo || !token || !name) {
    alert("Please fill in GitHub info and a scenario name.");
    return;
  }

  const path = folder ? \`\${folder}/\${name}.json\` : \`\${name}.json\`;
  const apiUrl = \`https://api.github.com/repos/\${user}/\${repo}/contents/\${path}\`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      alert("❌ File not found or access denied.");
      return;
    }

    const json = await res.json();
    const content = decodeURIComponent(escape(atob(json.content)));
    const parsed = JSON.parse(content);

    scenarioStore.scenarios[parsed.name] = parsed;
    scenarioStore.current = parsed;

    alert("✅ Scenario loaded successfully.");
    window.updateBlockSelector();
    renderCurrentScenario();
  } catch (e) {
    alert("❌ Load failed: " + e.message);
  }
};
