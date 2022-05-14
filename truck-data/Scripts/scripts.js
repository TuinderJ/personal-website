function searchForTruck(searchCondition) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  const unitNumberInput = document.getElementById('unit-number');
  const customerUnitNumberInput = document.getElementById('customer-unit-number');
  let unitNumberToSearch = '';
  
  if(searchCondition == 'Unit Number') {
    unitNumberToSearch = unitNumberInput.value;
  } else {
    unitNumberToSearch = customerUnitNumberInput.value;
  }
  
  for(let i = 0; i < data.length; i++) {
    if(data[i][searchCondition].indexOf(unitNumberToSearch) >= 0) {
      unitNumberInput.value = data[i]['Unit Number'];
      customerUnitNumberInput.value = data[i]['Customer Unit Number'];
      for(key in data[i]) {
        if(!(key == 'Unit Number')) {
          if(!(key == 'Customer Unit Number')) {
            if(!data[i][key] == '') {
              const newKey = document.createElement('div');
              newKey.classList.add('label');
              newKey.innerText = key + ':';

              const newValueContainer = document.createElement('div');
              newValueContainer.classList.add('value-container');
              
              const newValue = document.createElement('input');
              newValue.classList.add('value');
              newValue.setAttribute('readonly', true);
              newValue.setAttribute('disabled', true);
              newValue.value = data[i][key];
              newValueContainer.appendChild(newValue);
              
              const newDataSet = document.createElement('div');
              newDataSet.classList.add('dataset')
              newDataSet.appendChild(newKey)
              newDataSet.appendChild(newValueContainer)
              
              output.appendChild(newDataSet);
            }
          }
        }
      }
    }
  }
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
    navigator.clipboard.writeText(clicked.value)
  }
})