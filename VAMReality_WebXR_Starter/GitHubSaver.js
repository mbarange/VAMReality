
import { scenarioStore } from './ScenarioManager.js';
window.saveToGitHub = async function () {
  const user = document.getElementById("githubUser").value;
  const repo = document.getElementById("githubRepo").value;
  const token = document.getElementById("githubToken").value;
  const folder = document.getElementById("githubFolder").value || "";

  const scenario = JSON.parse(JSON.stringify(scenarioStore.current)); // deep clone


  if (!scenario || typeof scenario !== "object" || !scenario.name || !Array.isArray(scenario.blocks)) {
    console.warn("❌ Invalid scenario object:", scenario);
    alert("❌ No valid scenario selected. Please create or select one first.");
    return;
  }
  if (!user || !repo || !token ) {
    alert("Missing GitHub credentials.");
    return;
  }
  if (!scenario) {
    alert("Missing  scenario.");
    return;
  }

  let filename = scenario.name + ".json";
  let path = folder ? folder + "/" + filename : filename;
  let apiUrl = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + path;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(scenario, null, 2))));

  try {
    const check = await fetch(apiUrl, {
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json"
      }
    });

    let sha = undefined;
    if (check.ok) {
      const shouldOverwrite = confirm("Scenario already exists. Overwrite it?");
      if (!shouldOverwrite) {
        const newName = prompt("Enter a new scenario name:");
        if (!newName) {
          alert("❌ Save cancelled.");
          return;
        }
        scenario.name = newName;
        filename = scenario.name + ".json";
        path = folder ? folder + "/" + filename : filename;
        apiUrl = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + path;
      } else {
        const result = await check.json();
        sha = result.sha;
      }
    }

    const saveRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: check.ok ? "Update scenario" : "Create scenario",
        content,
        sha
      })
    });

    if (saveRes.ok) {
      alert("✅ Scenario saved to GitHub!");
    } else {
      const err = await saveRes.json();
      alert("❌ Save failed: " + (err.message || "Unknown error"));
    }
  } catch (err) {
    alert("❌ Error during Save : " + err.message);
  }
};

window.loadFromGitHub = async function () {
  const user = document.getElementById("githubUser").value;
  const repo = document.getElementById("githubRepo").value;
  const token = document.getElementById("githubToken").value;
  const folder = document.getElementById("githubFolder").value || "";

  if (!user || !repo || !token) {
    alert("Missing GitHub credentials.");
    return;
  }

  const apiUrl = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + folder;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const files = await res.json();
    const scenarioList = document.getElementById("scenarioList");
    scenarioList.innerHTML = "";

    files
      .filter((f) => f.name.endsWith(".json"))
      .forEach((file) => {
        const opt = document.createElement("option");
        opt.value = file.download_url;
        opt.text = file.name.replace(".json", "");
        scenarioList.appendChild(opt);
      });

    alert("✅ Scenario list loaded.");
  } catch (err) {
    alert("❌ Failed to fetch scenario list: " + err.message);
  }
};
