let data = {};
let currentTruckIndex;

$.get('database.csv', function (response, status) {
  if (status == 'success') {
    data = $.csv.toObjects(response);
    let html = '';
    for (let row in data) {
      html += '<tr>\r\n';
      for (let item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      $('#contents').html(html);
    }
  }
}).then(() => {
  const queryParams = new URLSearchParams(`?${window.location.href.split('?')[1]}`);
  const unitNumber = queryParams.get('unitNumber');
  if (unitNumber) {
    document.getElementById('unit-number').value = unitNumber;
    searchForTruck('Unit Number');
  }
});

function searchForTruck(searchCondition) {
  const newMultipleTrucksMenu = document.getElementById('multiple-trucks');
  if (newMultipleTrucksMenu != undefined) return;

  const oldOutput = document.getElementById('output');
  if (oldOutput != undefined) oldOutput.remove();

  const unitNumberInput = document.getElementById('unit-number');
  const customerUnitNumberInput = document.getElementById('customer-unit-number');
  const vinInput = document.getElementById('vin');
  const last8Input = document.getElementById('last-8');
  let unitNumberToSearch;
  currentTruckIndex = undefined;
  let last8Search = false;

  if (searchCondition === 'Unit Number') {
    unitNumberToSearch = unitNumberInput.value.trim().replace('-', '');
  } else if (searchCondition === 'Customer Unit Number') {
    unitNumberToSearch = customerUnitNumberInput.value.trim();
  } else if (searchCondition === 'VIN Number') {
    unitNumberToSearch = vinInput.value.trim();
  } else if (searchCondition === 'Last 8') {
    unitNumberToSearch = last8Input.value.trim();
    last8Search = true;
  }

  if (unitNumberToSearch === '') return alert('Please enter a search condition.');

  let tempStorage = [];

  for (let i = 0; i < data.length; i++) {
    if (last8Search) {
      if (data[i] != undefined && data[i]['VIN Number'].toLowerCase().substring(data[i]['VIN Number'].length - 8) === unitNumberToSearch.toLowerCase()) tempStorage.push(i);
    } else {
      if (data[i] != undefined && data[i][searchCondition].toLowerCase() === unitNumberToSearch.toLowerCase()) tempStorage.push(i);
    }
    1;
  }

  switch (tempStorage.length) {
    case 0:
      alert('Truck ' + unitNumberToSearch + ' was not found');
      break;
    case 1:
      displayTruck(tempStorage[0]);
      break;
    default:
      const newMultipleTrucks = document.createElement('div');
      newMultipleTrucks.classList.add('multiple-trucks');
      newMultipleTrucks.classList.add('flex');
      newMultipleTrucks.setAttribute('id', 'multiple-trucks');
      for (i in tempStorage) {
        const newMultipleTruck = document.createElement('div');
        newMultipleTruck.classList.add('multiple-truck');
        newMultipleTruck.setAttribute('id', tempStorage[i]);

        for (ii = 0; ii < 4; ii++) {
          const newDataSet = document.createElement('div');
          newDataSet.classList.add('dataset');
          newDataSet.classList.add('flex');

          const newLabel = document.createElement('div');
          const newValue = document.createElement('div');

          switch (ii) {
            case 0:
              newLabel.textContent = 'Unit Number:';
              newValue.textContent = data[tempStorage[i]]['Unit Number'];
              break;
            case 1:
              newLabel.textContent = 'Customer Unit Number:';
              newValue.textContent = data[tempStorage[i]]['Customer Unit Number'];
              break;
            case 2:
              newLabel.textContent = 'Customer:';
              newValue.textContent = data[tempStorage[i]]['Customer Name'];
              break;
            case 3:
              newLabel.textContent = 'VIN:';
              newValue.textContent = data[tempStorage[i]]['VIN Number'];
              break;
          }

          newDataSet.appendChild(newLabel);
          newDataSet.appendChild(newValue);
          newMultipleTruck.appendChild(newDataSet);
        }
        newMultipleTrucks.appendChild(newMultipleTruck);
      }
      document.body.appendChild(newMultipleTrucks);

      document.getElementById('multiple-trucks').addEventListener('click', e => {
        if (e.target.closest('.multiple-truck')) {
          document.getElementById('multiple-trucks').remove();
          displayTruck(e.target.closest('.multiple-truck').id);
        }
      });
      return;
  }
}

function displayTruck(i) {
  const unitNumberInput = document.getElementById('unit-number');
  const customerUnitNumberInput = document.getElementById('customer-unit-number');
  const vinInput = document.getElementById('vin');
  const last8Input = document.getElementById('last-8');
  const mainContent = document.getElementById('main-content');
  currentTruckIndex = i;
  const output = document.createElement('div');
  output.classList.add('output');
  output.classList.add('flex');
  output.setAttribute('id', 'output');

  const copyText = document.createElement('div');
  copyText.classList.add('copy-text');
  copyText.innerText = 'Left click on any value below to copy it.';
  output.appendChild(copyText);
  mainContent.appendChild(output);
  unitNumberInput.value = data[i]['Unit Number'];
  vinInput.value = data[i]['VIN Number'];
  customerUnitNumberInput.value = data[i]['Customer Unit Number'];
  last8Input.value = data[i]['VIN Number'].substring(data[i]['VIN Number'].length - 8);
  for (key in data[i]) {
    if (key !== 'Unit Number') {
      if (key !== 'Customer Unit Number') {
        if (key !== 'VIN Number') {
          if (!data[i][key] == '') {
            const newKey = document.createElement('div');
            newKey.classList.add('label');
            newKey.innerText = key + ':';

            const newValue = document.createElement('div');
            newValue.classList.add('value');
            newValue.innerText = data[i][key];

            const newDataSet = document.createElement('div');
            newDataSet.classList.add('dataset');
            newDataSet.classList.add('flex');
            newDataSet.appendChild(newKey);
            newDataSet.appendChild(newValue);

            output.appendChild(newDataSet);
          }
        }
      }
    }
  }
  if (data[i]['Eng Make'] === 'Cummins') engineButton('Open engine in Cummins', `https://parts.cummins.com/global-search/ebu/${data[i]['Eng SN']}`);
  if (data[i]['Eng Make'] === 'Paccar') engineButton('Open engine in RMI', `https://rmi.lob.paccar.net/Dealernet/DAGUI/Scripts/#/overview/${data[i]['VIN Number']}/${data[i]['VIN Number']}`);
  if (data[i]['Eng Make'] === 'Caterpillar') engineButton('Open engine in Cat', `https://sis2.cat.com/#/detail?serialNumber=${data[i]['Eng SN']}&tab=parts`);

  if (document.getElementById('output') === null) return;

  document.getElementById('output').addEventListener('click', e => {
    let clicked;
    if (e.target.matches('.value')) clicked = e.target;
    if (e.target.closest('.value')) clicked = e.target;
    if (clicked != null) {
      navigator.clipboard.writeText(clicked.innerText);
    }
  });
}

function engineButton(buttonText, url) {
  const engineURL = document.createElement('button');
  engineURL.textContent = buttonText;
  engineURL.addEventListener('click', e => {
    e.preventDefault();
    window.open(url, '_blank');
  });
  output.prepend(engineURL);
}

document.getElementById('unit-number-button').addEventListener('click', e => {
  e.preventDefault();
  searchForTruck('Unit Number');
});

document.getElementById('unit-number').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchForTruck('Unit Number');
    e.currentTarget.select();
  }
});

document.getElementById('customer-unit-number-button').addEventListener('click', e => {
  e.preventDefault();
  searchForTruck('Customer Unit Number');
});

document.getElementById('customer-unit-number').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchForTruck('Customer Unit Number');
    e.currentTarget.select();
  }
});

document.getElementById('vin-button').addEventListener('click', e => {
  e.preventDefault();
  searchForTruck('VIN Number');
});

document.getElementById('vin').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchForTruck('VIN Number');
    e.currentTarget.select();
  }
});

document.getElementById('customer-unit-number-button').addEventListener('click', e => {
  e.preventDefault();
  searchForTruck('Last 8');
});

document.getElementById('last-8').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchForTruck('Last 8');
    e.currentTarget.select();
  }
});
