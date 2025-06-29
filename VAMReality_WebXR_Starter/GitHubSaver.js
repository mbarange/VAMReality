
export async function saveScenarioToGitHub(scenarioName, content, token, user, repo, path) {
  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}/${scenarioName}.json`;

  // Get the SHA if file exists
  let sha = null;
  try {
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    if (getRes.ok) {
      const json = await getRes.json();
      sha = json.sha;
    }
  } catch (e) { console.warn("SHA not found, creating new file"); }

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Save scenario",
      content: btoa(unescape(encodeURIComponent(content))),
      sha
    })
  });

  if (!response.ok) throw new Error("Failed to save scenario: " + await response.text());
  console.log("✅ Scenario saved to GitHub");
}
