
import { scenarioStore } from './ScenarioManager.js';

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
    // Check if file exists to get SHA
    const res = await fetch(apiUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(scenario, null, 2))));

    let method = "PUT";
    let body = {
      message: "Update scenario",
      content: content,
      branch: "main"
    };

    if (res.ok) {
      const data = await res.json();
      body.sha = data.sha;
    } else if (res.status === 404) {
      body.message = "Create new scenario";
    } else {
      throw new Error("GitHub API error: " + res.statusText);
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
      alert("✅ Scenario saved to GitHub!");
    } else {
      const error = await upload.json();
      alert("❌ Failed to save: " + (error.message || "Unknown error"));
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
  const scenarioName = prompt("Enter scenario filename (without .json)");

  if (!user || !repo || !token || !scenarioName) {
    alert("Missing required info.");
    return;
  }

  const path = folder ? \`\${folder}/\${scenarioName}.json\` : \`\${scenarioName}.json\`;
  const apiUrl = \`https://api.github.com/repos/\${user}/\${repo}/contents/\${path}\`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "Authorization": \`token \${token}\`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) throw new Error("GitHub fetch failed");

    const data = await res.json();
    const decoded = JSON.parse(decodeURIComponent(escape(atob(data.content))));

    scenarioStore.scenarios[decoded.name] = decoded;
    scenarioStore.current = decoded;

    alert("✅ Scenario loaded from GitHub!");
    window.updateBlockSelector();
    window.renderCurrentScenario();
  } catch (e) {
    alert("❌ Load error: " + e.message);
  }
};
