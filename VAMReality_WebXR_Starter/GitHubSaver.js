
import { scenarioManager } from './main.js';

document.getElementById("saveBtn").onclick = async () => {
  const jsonData = scenarioManager.toJSON();
  const token = prompt("GitHub token:");
  const repo = prompt("GitHub repo (e.g. username/repo):");
  const filePath = "scenario.json";

  const apiURL = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const existing = await fetch(apiURL, {
    headers: { Authorization: `token ${token}` }
  }).then(r => r.ok ? r.json() : null);

  const response = await fetch(apiURL, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update scenario",
      content: btoa(unescape(encodeURIComponent(jsonData))),
      sha: existing?.sha
    })
  });

  if (response.ok) {
    alert("✅ Scenario saved to GitHub!");
  } else {
    alert("❌ Save failed");
    console.error(await response.text());
  }
};
