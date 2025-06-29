
import { scenarioStore, renderCurrentScenario } from './ScenarioManager.js';

export async function saveToGitHub() {
  const user = document.getElementById('githubUser').value;
  const repo = document.getElementById('githubRepo').value;
  const token = document.getElementById('githubToken').value;
  const folder = document.getElementById('githubFolder').value;
  const scenario = scenarioStore.current;

  if (!scenario || !user || !repo || !token) {
    alert("Missing required info or no scenario loaded.");
    return;
  }

  const filename = scenario.name + ".json";
  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folder ? folder + '/' : ''}${filename}`;
  let sha = null;

  try {
    const existing = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch {}

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: "token " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Save scenario",
      content: btoa(unescape(encodeURIComponent(JSON.stringify(scenario)))),
      sha: sha || undefined
    })
  });

  if (response.ok) {
    alert("✅ Scenario saved to GitHub");
  } else {
    alert("❌ Save failed: " + await response.text());
  }
}

export async function loadFromGitHub() {
  const user = document.getElementById('githubUser').value;
  const repo = document.getElementById('githubRepo').value;
  const token = document.getElementById('githubToken').value;
  const folder = document.getElementById('githubFolder').value;

  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folder}`;
  const res = await fetch(apiUrl, {
    headers: { Authorization: "token " + token }
  });

  if (!res.ok) {
    alert("❌ Failed to list scenarios");
    return;
  }

  const files = await res.json();
  const scenarioFiles = files.filter(f => f.name.endsWith('.json'));

  const dropdown = document.getElementById('scenarioList');
  dropdown.innerHTML = "";

  for (let file of scenarioFiles) {
    const option = document.createElement("option");
    option.value = option.textContent = file.name.replace(".json", "");
    dropdown.appendChild(option);
  }

  dropdown.onchange = async () => {
    const file = scenarioFiles.find(f => f.name.replace(".json", "") === dropdown.value);
    if (!file) return;

    const fileRes = await fetch(file.download_url);
    const data = await fileRes.json();
    scenarioStore.scenarios[data.name] = data;
    scenarioStore.current = data;
    renderCurrentScenario();
  };
}
