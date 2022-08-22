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
