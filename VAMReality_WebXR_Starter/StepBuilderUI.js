
let stepCounter = 0;

export function initializeStepBuilder() {
  document.getElementById('stepList').innerHTML = '';
}

window.addStep = function() {
  const list = document.getElementById('stepList');
  const name = document.getElementById('scenarioName').value || 'Step ' + (++stepCounter);
  const item = document.createElement('div');
  item.className = 'step-block';
  item.innerText = name;
  list.appendChild(item);
}
