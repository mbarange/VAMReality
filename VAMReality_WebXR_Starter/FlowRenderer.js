
export function drawFlowArrows() {
  const canvas = document.getElementById("flowCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const stepDivs = document.querySelectorAll(".flow-block");
  const positions = {};

  stepDivs.forEach((div, idx) => {
    const id = div.getAttribute("data-id");
    const rect = div.getBoundingClientRect();
    const parentRect = canvas.getBoundingClientRect();
    positions[id] = {
      x: rect.left + rect.width / 2 - parentRect.left,
      y: rect.top + rect.height / 2 - parentRect.top
    };
  });

  for (const id in positions) {
    const div = document.querySelector(`[data-id='${id}']`);
    if (!div) continue;
    const nextId = div.getAttribute("data-next");
    if (nextId && positions[nextId]) {
      drawArrow(ctx, positions[id], positions[nextId], "➝");
    }

    const conditions = div.getAttribute("data-conds");
    if (conditions) {
      const conds = JSON.parse(conditions);
      conds.forEach(c => {
        const target = `flow-${c.targetBlock}-${c.targetStep}`;
        if (positions[target]) {
          drawArrow(ctx, positions[id], positions[target], c.label, "green");
        }
      });
    }
  }
}

function drawArrow(ctx, from, to, label, color = "black") {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  ctx.fillStyle = color;
  ctx.font = "12px sans-serif";
  ctx.fillText(label, midX + 4, midY - 4);
}
