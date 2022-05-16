let currentTruckIndex;

function searchForTruck(searchCondition) {
  const output = document.getElementById('output')
  output.innerHTML = ''
  const copyText = document.createElement('div')
  copyText.classList.add('copy-text')
  copyText.innerText = 'Left click on any value below to copy it.'
  output.appendChild(copyText)
  const unitNumberInput = document.getElementById('unit-number')
  const customerUnitNumberInput = document.getElementById('customer-unit-number')
  let unitNumberToSearch = ''
  
  if(searchCondition == 'Unit Number') {
    unitNumberToSearch = unitNumberInput.value
  } else {
    unitNumberToSearch = customerUnitNumberInput.value
  }
  
  for(let i = 0; i < data.length; i++) {
    if(data[i][searchCondition].indexOf(unitNumberToSearch) >= 0) {
      currentTruckIndex = i
      unitNumberInput.value = data[i]['Unit Number']
      customerUnitNumberInput.value = data[i]['Customer Unit Number']
      for(key in data[i]) {
        if(!(key == 'Unit Number')) {
          if(!(key == 'Customer Unit Number')) {
            if(!data[i][key] == '') {
              const newKey = document.createElement('div')
              newKey.classList.add('label')
              newKey.innerText = key + ':'

              const newValueContainer = document.createElement('div')
              newValueContainer.classList.add('value-container')
              
              const newValue = document.createElement('div')
              newValue.classList.add('value')
              newValue.innerText = data[i][key]
              newValueContainer.appendChild(newValue)

              const newDataSet = document.createElement('div')
              newDataSet.classList.add('dataset')
              newDataSet.appendChild(newKey)
              newDataSet.appendChild(newValueContainer)
              
              output.appendChild(newDataSet)
            }
          }
        }
      }
    }
  }
}

function newTruckForm() {
  const newTruckForm = document.createElement('div');
  newTruckForm.classList.add('new-truck-form');
  newTruckForm.setAttribute('id', 'new-truck-form');
  const newSubmitButton = document.createElement('button');
  newSubmitButton.classList.add('menu-button');
  newSubmitButton.setAttribute('onclick', 'submitNewTruck()');
  newSubmitButton.textContent = 'Submit';
  newTruckForm.appendChild(newSubmitButton);
  document.body.appendChild(newTruckForm);
  
  for (key in data[0]) {
    const newDataset = document.createElement('div');
    newDataset.classList.add('dataset');

    const newLabel = document.createElement('div');
    newLabel.classList.add('label');
    newLabel.innerText = key + ':';
    
    const newValue = document.createElement('input');
    newValue.classList.add('value')

    newDataset.appendChild(newLabel);
    newDataset.appendChild(newValue);

    newTruckForm.appendChild(newDataset);
  }
}

function submitNewTruck() {
  const newTruckForm = document.getElementById('new-truck-form');
  newTruckForm.remove();
}

function editCurrentTruck() {
  if (currentTruckIndex === undefined) {
    alert('Please select a truck first.')
    return
  }
  const unitNumberToSearch = document.getElementById('unit-number').value;
  const newTruckForm = document.createElement('div');
  newTruckForm.classList.add('new-truck-form');
  newTruckForm.setAttribute('id', 'new-truck-form');
  const newSubmitButton = document.createElement('button');
  newSubmitButton.classList.add('menu-button');
  newSubmitButton.setAttribute('onclick', 'submitTruckEdit()');
  newSubmitButton.textContent = 'Submit';
  newTruckForm.appendChild(newSubmitButton);
  document.body.appendChild(newTruckForm);

  for(key in data[currentTruckIndex]) {
    const newKey = document.createElement('div');
    newKey.classList.add('label');
    newKey.innerText = key + ':';

    const newValue = document.createElement('input');
    newValue.classList.add('value');
    newValue.value = data[currentTruckIndex][key];
    
    const newDataSet = document.createElement('div');
    newDataSet.classList.add('dataset');
    newDataSet.appendChild(newKey);
    newDataSet.appendChild(newValue);
    
    newTruckForm.appendChild(newDataSet);
  }
}

function submitTruckEdit () {
  const newTruckForm = document.getElementById('new-truck-form');
  newTruckForm.remove();
}

document.getElementById('unit-number').addEventListener('keypress', function(event) {
  if(event.key === "Enter") {
    searchForTruck('Unit Number');
    event.currentTarget.select();
  }
})

document.getElementById('customer-unit-number').addEventListener('keypress', function(event) {
  if(event.key === "Enter") {
    searchForTruck('Customer Unit Number');
    event.currentTarget.select();
  }
})

document.getElementById('output').addEventListener('click', e => {
  let clicked
  if(e.target.matches('.value')) {
    clicked = e.target
  }
  if(e.target.closest('.value')) {
    clicked = e.target
  }
  if(clicked != null) {
    navigator.clipboard.writeText(clicked.innerText)
  }
})