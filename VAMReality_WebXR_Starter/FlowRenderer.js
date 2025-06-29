
export function renderFlow(steps) {
  const container = document.getElementById('flowBlocks');
  container.innerHTML = '';

  steps.forEach((step, i) => {
    const div = document.createElement('div');
    div.className = 'flow-block';
    div.style.margin = '10px';
    div.style.padding = '10px';
    div.style.border = '1px solid #ccc';
    div.innerText = step;
    container.appendChild(div);

    if (i < steps.length - 1) {
      const arrow = document.createElement('div');
      arrow.innerHTML = '&darr;';
      arrow.style.textAlign = 'center';
      container.appendChild(arrow);
    }
  });
}
