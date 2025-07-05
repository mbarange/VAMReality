
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
  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const files = await res.json();
    if (!Array.isArray(files)) throw new Error("Unexpected response format.");

    // Filter scenario files
    const scenarioFiles = files.filter(f => f.name.endsWith(".json"));

    // Clear dropdown
    scenarioList.innerHTML = "";

    // Populate dropdown with preview names
    for (const file of scenarioFiles) {
      try {
        const raw = await fetch(file.download_url);
        const data = await raw.json();
        const previewName = data.name || file.name.replace(".json", "");
        const opt = document.createElement("option");
        opt.value = file.download_url;
        opt.text = `${previewName} (${file.name})`;
        scenarioList.appendChild(opt);
      } catch (err) {
        console.warn(`⚠️ Failed to parse ${file.name}`, err);
      }
    }

    alert("✅ Scenario list loaded.");
  } catch (err) {
    alert("❌ Failed to fetch scenario list: " + err.message);
  }
};
