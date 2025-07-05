
import { scenarioStore, updateScenarioList,renderCurrentScenario  } from './ScenarioManager.js';
window.saveToGitHub = async function () {
  const token = document.getElementById("githubToken").value.trim();
  const user = document.getElementById("githubUser").value.trim();
  const repo = document.getElementById("githubRepo").value.trim();
  const folder = document.getElementById("githubFolder").value.trim();
 
  const scenario = JSON.parse(JSON.stringify(scenarioStore.current)); // deep clone

  
  if (!scenario || typeof scenario !== "object" || !scenario.name || !Array.isArray(scenario.blocks)) {
    console.warn("❌ Invalid scenario object:", scenario);
    alert("❌ No valid scenario selected. Please create or select one first.");
    return;
  }

  console.log("📦 Saving scenario: ", scenario);

  const path = folder ? `${folder}/${scenario.name}.json` : `${scenario.name}.json`;
  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

  try {
    const check = await fetch(apiUrl, {
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    let sha = null;
    if (check.ok) {
      const data = await check.json();
      const confirmReplace = confirm("Scenario already exists on GitHub. Replace it?");
      if (!confirmReplace) return;
      sha = data.sha;
    }

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Save scenario: ${scenario.name}`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(scenario, null, 2)))),
        sha: sha
      })
    });

    if (response.ok) {
      alert("✅ Scenario saved to GitHub!");
    } else {
      const error = await response.json();
      alert("❌ Failed to save scenario: " + (error.message || response.statusText));
    }

  } catch (err) {
    alert("❌ Error during save: " + err.message);
  }
};


window.loadFromGitHub = async function () {
  const user = document.getElementById("githubUser").value.trim();
  const repo = document.getElementById("githubRepo").value.trim();
  const token = document.getElementById("githubToken").value.trim();
  const folder = document.getElementById("githubFolder").value.trim();
  const scenarioList = document.getElementById("scenarioList");

  if (!user || !repo || !token) {
    alert("Missing GitHub credentials.");
    return;
  }

  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folder}`;
  scenarioList.innerHTML = `<option>Loading...</option>`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const files = await res.json();
    if (!Array.isArray(files)) throw new Error("Invalid file list");

    const scenarioFiles = files.filter((f) => f.name.endsWith(".json"));
    scenarioList.innerHTML = "";

    for (const file of scenarioFiles) {
      const rawRes = await fetch(file.download_url);
      const data = await rawRes.json();
      const previewName = data.name || file.name.replace(".json", "");
      const opt = document.createElement("option");
      opt.value = file.download_url;
      opt.text = `${previewName} (${file.name})`;
      scenarioList.appendChild(opt);
    }

    alert("✅ Scenario list with previews loaded.");
  } catch (err) {
    alert("❌ Failed to fetch scenario previews: " + err.message);
    scenarioList.innerHTML = `<option disabled>Failed to load</option>`;
  }
};
