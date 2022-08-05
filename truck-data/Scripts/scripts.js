let data = {}
let currentTruckIndex

$.get("database.csv", function(response, status) {
  if (status=="success") {
    data = $.csv.toObjects(response)
    let html = ''
    const body = document.querySelector("body")
    for (let row in data) {
      html += '<tr>\r\n'
      for (let item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n'
      }
      $('#contents').html(html)
    }
  }
})

function searchForTruck(searchCondition) {
  const newMultipleTrucksMenu = document.getElementById('multiple-trucks')
  if (newMultipleTrucksMenu != undefined) {return}
  
  const oldOutput = document.getElementById('output')
  if (oldOutput != undefined) {
    oldOutput.remove()
  }
  
  const unitNumberInput = document.getElementById('unit-number')
  const customerUnitNumberInput = document.getElementById('customer-unit-number')
  let unitNumberToSearch
  currentTruckIndex = undefined
  
  if (searchCondition === 'Unit Number') {
    unitNumberToSearch = unitNumberInput.value
  } else if (searchCondition === 'Customer Unit Number') {
    unitNumberToSearch = customerUnitNumberInput.value
  }

  if (unitNumberToSearch === '') {
    alert('Please enter a unit number or customer unit number.')
    return
  }
  
  let tempStorage = []

  for (let i = 0; i < data.length; i++) {
    if (data[i] != undefined) {
      if (data[i][searchCondition] === unitNumberToSearch) {
        tempStorage.push(i)
      }
    }
  }

  switch (tempStorage.length) {
  case 0:
    alert('Truck ' + unitNumberToSearch + ' was not found')
    break
  case 1:
    displayTruck(tempStorage[0])
    break
  default:
    const newMultipleTrucks = document.createElement('div')
    newMultipleTrucks.classList.add('multiple-trucks')
    newMultipleTrucks.classList.add('flex')
    newMultipleTrucks.setAttribute('id','multiple-trucks')
    for (i in tempStorage) {
      const newMultipleTruck = document.createElement('div')
      newMultipleTruck.classList.add('multiple-truck')
      newMultipleTruck.setAttribute('id', tempStorage[i])

      for (ii = 0; ii < 4; ii++) {
        const newDataSet = document.createElement('div')
        newDataSet.classList.add('dataset')
        newDataSet.classList.add('flex')

        const newLabel = document.createElement('div')
        const newValue = document.createElement('div')

        switch (ii) {
        case 0:
          newLabel.textContent = 'Unit Number:'
          newValue.textContent = data[tempStorage[i]]['Unit Number']
          break
        case 1:
          newLabel.textContent = 'Customer Unit Number:'
          newValue.textContent = data[tempStorage[i]]['Customer Unit Number']
          break
        case 2:
          newLabel.textContent = 'Customer:'
          newValue.textContent = data[tempStorage[i]]['Customer Name']
          break
        case 3:
          newLabel.textContent = 'VIN:'
          newValue.textContent = data[tempStorage[i]]['VIN Number']
          break
        }

        newDataSet.appendChild(newLabel)
        newDataSet.appendChild(newValue)
        newMultipleTruck.appendChild(newDataSet)
      }
      newMultipleTrucks.appendChild(newMultipleTruck)
    }
    document.body.appendChild(newMultipleTrucks)

    document.getElementById('multiple-trucks').addEventListener('click', e => {
      if (e.target.closest('.multiple-truck')) {
        document.getElementById('multiple-trucks').remove()
        displayTruck(e.target.closest('.multiple-truck').id)
      }
    })
    return
  }
}

function displayTruck(i) {
  const unitNumberInput = document.getElementById('unit-number')
  const customerUnitNumberInput = document.getElementById('customer-unit-number')
  const mainContent = document.getElementById('main-content')
  currentTruckIndex = i
  const output = document.createElement('div')
  output.classList.add('output')
  output.classList.add('flex')
  output.setAttribute('id','output')

  const copyText = document.createElement('div')
  copyText.classList.add('copy-text')
  copyText.innerText = 'Left click on any value below to copy it.'
  output.appendChild(copyText)
  unitNumberInput.value = data[i]['Unit Number']
  customerUnitNumberInput.value = data[i]['Customer Unit Number']
  for (key in data[i]) {
    if (!(key == 'Unit Number')) {
      if (!(key == 'Customer Unit Number')) {
        if (!data[i][key] == '') {
          const newKey = document.createElement('div')
          newKey.classList.add('label')
          newKey.innerText = key + ':'
          
          const newValue = document.createElement('div')
          newValue.classList.add('value')
          newValue.innerText = data[i][key]
          
          const newDataSet = document.createElement('div')
          newDataSet.classList.add('dataset')
          newDataSet.classList.add('flex')
          newDataSet.appendChild(newKey)
          newDataSet.appendChild(newValue)
          
          output.appendChild(newDataSet)
          if (key == 'VIN Number') {
            const newVIN8Key = document.createElement('div')
            newVIN8Key.classList.add('label')
            newVIN8Key.innerText = 'Last 8 of VIN:'
            
            const newVIN8ValueContainer = document.createElement('div')
            newVIN8ValueContainer.classList.add('value-container')
            
            const newVIN8Value = document.createElement('div')
            newVIN8Value.classList.add('value')
            newVIN8Value.innerText = data[i][key].substring(data[i][key].length - 8)
            newVIN8ValueContainer.appendChild(newVIN8Value)
            
            const newDataSet = document.createElement('div')
            newDataSet.classList.add('dataset')
            newDataSet.classList.add('flex')
            newDataSet.appendChild(newVIN8Key)
            newDataSet.appendChild(newVIN8ValueContainer)

            output.appendChild(newDataSet)
            mainContent.appendChild(output)
          }
        }
      }
    }
  }
  
  if (document.getElementById('output') === null) {
    return
  }

  document.getElementById('output').addEventListener('click', e => {
    let clicked
    if (e.target.matches('.value')) {
      clicked = e.target
    }
    if (e.target.closest('.value')) {
      clicked = e.target
    }
    if (clicked != null) {
      navigator.clipboard.writeText(clicked.innerText);
      
      const copyMessageBox = document.getElementsByClassName('copy-message-box');
      copyMessageBox[0].style.top = `${e.clientY}px`;
      copyMessageBox[0].style.left = `${e.clientX}px`;
      copyMessageBox[0].style.display = 'initial';
      copyMessageBox[0].style.opacity = '1';
      setTimeout( function() {
        copyMessageBox[0].style.opacity = '0';
        setTimeout( function() {
          copyMessageBox[0].style.display = 'none';
        }, 2000);
      }, 500);
    }
  })
}

function newTruckForm() {
  if (document.getElementById('new-truck-form') != null) {
    alert('Please finish the form that you are working on first.')
    return
  }
  const mainContainer = document.getElementById('main-container')

  const mainContent = document.getElementById('main-content')

  const menu = document.getElementById('menu')
  mainContent.style.display ='none'
  menu.style.display ='none'

  const newTruckForm = document.createElement('div')
  newTruckForm.classList.add('new-truck-form')
  newTruckForm.classList.add('flex')
  newTruckForm.setAttribute('id', 'new-truck-form')

  const newSubmitButton = document.createElement('button')
  newSubmitButton.classList.add('menu-button')
  newSubmitButton.setAttribute('onclick', 'submitNewTruck()')
  newSubmitButton.textContent = 'Submit'

  const newCancelButton = document.createElement('button')
  newCancelButton.classList.add('menu-button')
  newCancelButton.setAttribute('onclick', 'cancelNewTruck()')
  newCancelButton.textContent = 'Cancel'

  newTruckForm.appendChild(newSubmitButton)
  newTruckForm.appendChild(newCancelButton)
  mainContainer.appendChild(newTruckForm)
  
  for (key in data[0]) {
    const newDataset = document.createElement('div')
    newDataset.classList.add('dataset')
    newDataset.classList.add('flex')

    const newLabel = document.createElement('div')
    newLabel.classList.add('label')
    newLabel.innerText = key + ':'
    
    const newValue = document.createElement('input')

    newDataset.appendChild(newLabel)
    newDataset.appendChild(newValue)

    newTruckForm.appendChild(newDataset)
  }

  document.getElementById('new-truck-form').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      submitNewTruck()
    }
  })
}

function submitNewTruck() {
  const newTruckForm = document.getElementById('new-truck-form')
  const newTruckInfo = newTruckForm.getElementsByClassName('value')

  if (newTruckInfo[0].value === '' && newTruckInfo[1].value === '') {
    alert('Enter a unit number before submitting')
    return
  }

  let newTruck = Object.create(Object)
  
  let i = 0
  for (key in data[0]) {
    newTruck[key] = newTruckInfo[i].value
    i++
  }
  
  data.push(newTruck)
  newTruckForm.remove()
  const unitNumberInput = document.getElementById('unit-number')
  const customerUnitNumberInput = document.getElementById('customer-unit-number')
  
  const mainContent = document.getElementById('main-content')
  mainContent.style.display = 'flex'
  const menu = document.getElementById('menu')
  menu.style.display = 'flex'
  
  if (newTruck['Unit Number'] != '') {
    unitNumberInput.value = newTruck['Unit Number']
    searchForTruck('Unit Number')
    return
  }
  
  if (newTruck['Customer Unit Number'] != '') {
    customerUnitNumberInput.value = newTruck['Customer Unit Number']
    searchForTruck('Customer Unit Number')
  }
}

function cancelNewTruck() {
  const newTruckForm = document.getElementById('new-truck-form');
  newTruckForm.remove();

  const mainContent = document.getElementById('main-content')
  mainContent.style.display = 'flex'
  const menu = document.getElementById('menu')
  menu.style.display = 'flex'
}

function editCurrentTruck() {
  if (currentTruckIndex === undefined) {
    alert('Please select a truck first.')
    return
  }
  if (document.getElementById('new-truck-form') != null) {
    alert('Please finish the form that you are working on first.')
    return
  }
  const mainContainer = document.getElementById('main-container')

  const mainContent = document.getElementById('main-content')

  const menu = document.getElementById('menu')
  mainContent.style.display ='none'
  menu.style.display ='none'

  const newTruckForm = document.createElement('div')
  newTruckForm.classList.add('new-truck-form')
  newTruckForm.classList.add('flex')
  newTruckForm.setAttribute('id', 'new-truck-form')

  const newSubmitButton = document.createElement('button')
  newSubmitButton.classList.add('menu-button')
  newSubmitButton.setAttribute('onclick', 'submitTruckEdit()')
  newSubmitButton.textContent = 'Submit'

  const newCancelButton = document.createElement('button')
  newCancelButton.classList.add('menu-button')
  newCancelButton.setAttribute('onclick', 'cancelNewTruck()')
  newCancelButton.textContent = 'Cancel'

  newTruckForm.appendChild(newSubmitButton)
  newTruckForm.appendChild(newCancelButton)
  mainContainer.appendChild(newTruckForm)
  
  for (key in data[currentTruckIndex]) {
    const newKey = document.createElement('div');
    newKey.classList.add('label');
    newKey.innerText = key + ':';
    
    const newValue = document.createElement('input');
    newValue.value = data[currentTruckIndex][key];
    
    const newDataSet = document.createElement('div');
    newDataSet.classList.add('dataset');
    newDataSet.classList.add('flex');
    newDataSet.appendChild(newKey);
    newDataSet.appendChild(newValue);
    
    newTruckForm.appendChild(newDataSet);
  }
  
  document.getElementById('new-truck-form').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      submitTruckEdit()
    }
  })
}

function submitTruckEdit () {
  const newTruckForm = document.getElementById('new-truck-form')
  const newData = newTruckForm.getElementsByClassName('value')
  let i = 0
  for (key in data[currentTruckIndex]) {
    data[currentTruckIndex][key] = newData[i].value
    i++
  }

  newTruckForm.remove();

  const mainContent = document.getElementById('main-content')
  mainContent.style.display = 'flex'
  const menu = document.getElementById('menu')
  menu.style.display = 'flex'

  searchForTruck('Unit Number')
}

function removeCurrentTruck () {
  if (currentTruckIndex === undefined) {
    alert('Please select a truck first.')
    return
  }

  const removeButton = document.getElementById('remove-current-truck-button')
  removeButton.innerHTML = ''

  const confirmButton = document.createElement('button')
  confirmButton.classList.add('menu-button')
  confirmButton.setAttribute('onclick', 'confirmRemove()')
  confirmButton.textContent = 'Confirm'
  
  const cancelButton = document.createElement('button')
  cancelButton.classList.add('menu-button')
  cancelButton.setAttribute('onclick', 'cancelRemove()')
  cancelButton.textContent = 'Cancel'

  removeButton.appendChild(confirmButton)
  removeButton.appendChild(cancelButton)
}

function confirmRemove() {
  const removeButton = document.getElementById('remove-current-truck-button')
  removeButton.innerHTML = ''

  const newRemoveButton = document.createElement('button')
  newRemoveButton.classList.add('menu-button')
  newRemoveButton.setAttribute('onclick', 'removeCurrentTruck()')
  newRemoveButton.textContent = 'Remove Current Truck'
  removeButton.appendChild(newRemoveButton)

  delete data[currentTruckIndex]
  currentTruckIndex = null

  const unitNumberInput = document.getElementById('unit-number')
  unitNumberInput.value = ''
  const customerUnitNumberInput = document.getElementById('customer-unit-number')
  customerUnitNumberInput.value = ''

  const output = document.getElementById('output')
  output.innerHTML = ''
}

function cancelRemove() {
  const removeButton = document.getElementById('remove-current-truck-button')
  removeButton.innerHTML = ''
  const newRemoveButton = document.createElement('button')
  newRemoveButton.classList.add('menu-button')
  newRemoveButton.setAttribute('onclick', 'removeCurrentTruck()')
  newRemoveButton.textContent = 'Remove Current Truck'
  removeButton.appendChild(newRemoveButton)
}

function notEnabled() {
  alert('This function is not enabled yet.')
}

function submitChanges() {
  
}

document.getElementById('unit-number').addEventListener('keypress', e => {
  if (e.key === "Enter") {
    searchForTruck('Unit Number');
    e.currentTarget.select();
  }
})

document.getElementById('customer-unit-number').addEventListener('keypress', e => {
  if (e.key === "Enter") {
    searchForTruck('Customer Unit Number');
    e.currentTarget.select();
  }
})
