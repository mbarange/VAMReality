
import { scenarioStore } from './ScenarioManager.js';


export function drawScenarioGraph() {
  const svg = document.getElementById("graphCanvas");
  svg.innerHTML = "";

  const ns = "http://www.w3.org/2000/svg";
  let y = 50;

  // Arrow marker definitions
  const defs = document.createElementNS(ns, "defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#000"/>
    </marker>
    <marker id="condArrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="red"/>
    </marker>`;
  svg.appendChild(defs);

  const nodePositions = {}; // Keep track of node positions for conditional lines

  scenarioStore.current?.blocks?.forEach((block, bIdx) => {
    let x = 50;

    block.steps.forEach((step, sIdx) => {
      const id = `B${bIdx}_S${sIdx}`;
      const nodeX = x;
      const nodeY = y;
      nodePositions[id] = { x: nodeX, y: nodeY };

      const node = document.createElementNS(ns, "rect");
      node.setAttribute("x", nodeX);
      node.setAttribute("y", nodeY);
      node.setAttribute("width", 140);
      node.setAttribute("height", 60);
      node.setAttribute("fill", "#add8e6");
      node.setAttribute("stroke", "#333");
      node.setAttribute("rx", "6");
      svg.appendChild(node);

      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", nodeX + 10);
      label.setAttribute("y", nodeY + 20);
      label.textContent = `${bIdx + 1}.${sIdx + 1}`;
      label.setAttribute("font-size", "12");
      label.setAttribute("fill", "#000");
      svg.appendChild(label);

      const nameText = document.createElementNS(ns, "text");
      nameText.setAttribute("x", nodeX + 10);
      nameText.setAttribute("y", nodeY + 40);
      nameText.textContent = step.name || "Unnamed";
      nameText.setAttribute("font-size", "12");
      nameText.setAttribute("fill", "#000");
      svg.appendChild(nameText);

      // Next step in the block
      if (sIdx < block.steps.length - 1) {
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", nodeX + 140);
        line.setAttribute("y1", nodeY + 30);
        line.setAttribute("x2", nodeX + 190);
        line.setAttribute("y2", nodeY + 30);
        line.setAttribute("stroke", "#000");
        line.setAttribute("marker-end", "url(#arrow)");
        svg.appendChild(line);
      }

      x += 200;
    });

    y += 120;
  });

  // Conditional arrows (in red, curved)
  scenarioStore.current?.blocks?.forEach((block, bIdx) => {
    block.steps?.forEach((step, sIdx) => {
      const fromId = `B${bIdx}_S${sIdx}`;
      step.conditions?.forEach((cond) => {
        const toId = `B${cond.target.block}_S${cond.target.step}`;
        const from = nodePositions[fromId];
        const to = nodePositions[toId];
        if (!from || !to) return;

        const path = document.createElementNS(ns, "path");
        const deltaX = to.x - from.x;
        const deltaY = to.y - from.y;
        const controlX = from.x + deltaX / 2;
        const controlY = from.y + deltaY / 2 - 40; // control point for curve

        path.setAttribute("d", `M${from.x + 140},${from.y + 30} Q${controlX},${controlY} ${to.x},${to.y + 30}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "red");
        path.setAttribute("stroke-dasharray", "5,3");
        path.setAttribute("marker-end", "url(#condArrow)");
        svg.appendChild(path);
      });
    });
  });
}
}
