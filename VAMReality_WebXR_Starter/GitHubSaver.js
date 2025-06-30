
window.saveToGitHub = async function () {
  const user = document.getElementById("githubUser").value;
  const repo = document.getElementById("githubRepo").value;
  const token = document.getElementById("githubToken").value;
  const folder = document.getElementById("githubFolder").value || "";
  const scenario = window.scenarioStore?.current;

  if (!user || !repo || !token || !scenario) {
    alert("Missing GitHub credentials or scenario data.");
    return;
  }

  const filename = scenario.name + ".json";
  const path = folder ? folder + "/" + filename : filename;
  const apiUrl = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + path;

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(scenario, null, 2))));

  try {
    const checkRes = await fetch(apiUrl, {
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const isUpdating = checkRes.ok;
    const sha = isUpdating ? (await checkRes.json()).sha : undefined;

    const saveRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: isUpdating ? "Update scenario" : "Create scenario",
        content: content,
        sha: sha,
      }),
    });

    if (saveRes.ok) {
      alert("✅ Scenario saved to GitHub!");
    } else {
      const err = await saveRes.json();
      alert("❌ Save failed: " + (err.message || "Unknown error"));
    }
  } catch (err) {
    alert("❌ Error: " + err.message);
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
        Accept: "application/vnd.github.v3+json",
      },
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
