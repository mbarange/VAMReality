
import { scenarioStore } from './ScenarioManager.js';

export function drawScenarioGraph() {
  const svg = document.getElementById("graphCanvas");
  svg.innerHTML = "";

  const ns = "http://www.w3.org/2000/svg";
  let y = 50;

  // Arrow marker definition
  const defs = document.createElementNS(ns, "defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#000"/>
    </marker>`;
  svg.appendChild(defs);

  scenarioStore.current?.blocks?.forEach((block, bIdx) => {
    let x = 50;

    block.steps.forEach((step, sIdx) => {
      const id = `B${bIdx}_S${sIdx}`;

      const node = document.createElementNS(ns, "rect");
      node.setAttribute("x", x);
      node.setAttribute("y", y);
      node.setAttribute("width", 120);
      node.setAttribute("height", 50);
      node.setAttribute("fill", "#add8e6");
      node.setAttribute("stroke", "#333");
      node.setAttribute("rx", "6");
      svg.appendChild(node);

      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", x + 10);
      label.setAttribute("y", y + 30);
      label.textContent = `${bIdx + 1}.${sIdx + 1}`;
      label.setAttribute("font-size", "14");
      label.setAttribute("fill", "#000");
      svg.appendChild(label);

      // Next step in the block
      if (sIdx < block.steps.length - 1) {
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", x + 120);
        line.setAttribute("y1", y + 25);
        line.setAttribute("x2", x + 170);
        line.setAttribute("y2", y + 25);
        line.setAttribute("stroke", "#000");
        line.setAttribute("marker-end", "url(#arrow)");
        svg.appendChild(line);
      }

      x += 160;
    });

    y += 100;
  });
}
