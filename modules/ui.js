import { Gun } from "./gun.js";
import { ShipDisplay } from "./shipDisplay.js";

var dropdowns = [];
var firstShipDisplay = new ShipDisplay();
var secondShipDisplay = new ShipDisplay();

export function display(data, startBattleCallback) {
    displayModules(data.modules);
    displayGuns(data.guns);
    displayShips(data);
    displayStartBattleButton(startBattleCallback);
}

export function updateShipsDisplay(firstShip, secondShip) {
    updateShipDisplay(firstShip, firstShipDisplay);
    updateShipDisplay(secondShip, secondShipDisplay);
}

function displayModules(modulesData) {
    const row = createTableRow();

    modulesData.forEach(element => {
        const nameCell = document.createElement('td');
        nameCell.textContent = element.name;

        const list = document.createElement('ul');

        function tryAddModuleDescription(value, description) {
            if (value == 0) {
                return;
            }

            addListDescriptionElement(description, list);
        }

        tryAddModuleDescription(element.healthPoints, `${withSign(element.healthPoints)} очков здоровья`);
        tryAddModuleDescription(element.shieldPoints, `${withSign(element.shieldPoints)} очков щита`);
        tryAddModuleDescription(element.reloadSpeed, `${withSign(element.reloadSpeed * 100)}% скорость перезарядки`);
        tryAddModuleDescription(element.shieldRecovery, `${withSign(element.shieldRecovery * 100)}% скорость восстановления щита`);

        nameCell.appendChild(list);
        row.appendChild(nameCell);
    });
}

function displayGuns(gunsData) {
    const row = createTableRow();

    gunsData.forEach(element => {
        const nameCell = document.createElement('td');
        nameCell.textContent = element.name;

        const list = document.createElement('ul');

        addListDescriptionElement(`Скорость перезарядки ${element.reloadTime} сек`, list);
        addListDescriptionElement(`Урон ${element.damage}`, list);

        nameCell.appendChild(list);
        row.appendChild(nameCell);
    });
}

function displayShips(data) {
    const shipsDiv = document.createElement('div');
    document.body.appendChild(shipsDiv);

    dropdowns = [];

    const shipsTable = document.createElement('table');
    const shipTableBody = document.createElement('tbody');
    const shipsRow = document.createElement('tr');
    const firstShipCell = document.createElement('td');
    const secondShipCell = document.createElement('td');

    displayShip(data.firstShip, firstShipDisplay, firstShipCell, data.guns, data.modules);
    displayShip(data.secondShip, secondShipDisplay, secondShipCell, data.guns, data.modules);

    shipsRow.appendChild(firstShipCell);
    shipsRow.appendChild(secondShipCell);
    shipTableBody.appendChild(shipsRow);
    shipsTable.appendChild(shipTableBody);
    shipsDiv.appendChild(shipsTable);
}

function displayShip(shipData, shipDisplay, shipCell, gunsData, modulesData) {
    shipCell.textContent = shipData.name;

    const list = document.createElement('ul');
    shipDisplay.healthPoints = addListDescriptionElement('', list);
    shipDisplay.shieldPoints = addListDescriptionElement('', list);
    shipDisplay.shieldRecovery = addListDescriptionElement('', list);

    updateShipDisplay(shipData, shipDisplay);

    function choosedGun(gunName, index) {
        if (gunName === '') {
            shipData.guns[index] = null;
            return;
        }

        let targetGun = gunsData.find(function (item) {
            return item.name == gunName;
        });

        shipData.guns[index] = new Gun(targetGun.name, targetGun.reloadTime, targetGun.damage);
    }

    function choosedModule(moduleName, index) {
        if (moduleName === '') {
            shipData.modules[index] = null;
            return;
        }

        let targetModule = modulesData.find(function (item) {
            return item.name == moduleName;
        });

        shipData.modules[index] = Object.assign({}, targetModule);
    }

    for (let i = 0; i < shipData.gunSlots; i++) {
        addDropdownElement(gunsData, list, 'Выбери пушку', i, choosedGun);
    }

    for (let i = 0; i < shipData.moduleSlots; i++) {
        addDropdownElement(modulesData, list, 'Выбери модуль', i, choosedModule);
    }

    shipCell.appendChild(list);
}

function updateShipDisplay(shipData, shipDisplay) {
    shipDisplay.healthPoints.textContent = `Очки здоровья: ${shipData.healthPoints.toFixed(1)}`;
    shipDisplay.shieldPoints.textContent = `Очки щита: ${shipData.shieldPoints.toFixed(1)}`;
    shipDisplay.shieldRecovery.textContent = `Восстановление щита / сек: ${shipData.shieldRecovery}`;
}

function displayStartBattleButton(startBattleCallback) {
    const row = createTableRow();
    const cell = document.createElement('td');

    const button = document.createElement('button');
    button.textContent = 'Начать бой';
    button.addEventListener('click', function () {
        button.disabled = true;

        dropdowns.forEach(dropdown => {
            dropdown.disabled = true;
        })

        startBattleCallback();
    });

    cell.appendChild(button);
    row.appendChild(cell);
}

function createTableRow() {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    const row = document.createElement('tr');

    tableBody.appendChild(row);
    table.appendChild(tableBody);
    document.body.appendChild(table);

    return row;
}

function addListDescriptionElement(description, list) {
    const descriptionElement = document.createElement('li');
    descriptionElement.textContent = description;
    list.appendChild(descriptionElement);

    return descriptionElement;
}

function addDropdownElement(data, list, defaultOptionText, index, callback) {
    const listElement = document.createElement('li');
    const dropdown = document.createElement('select');

    dropdowns.push(dropdown);

    function createOption(textContent, value) {
        var option = document.createElement('option');
        option.textContent = textContent;
        option.value = value;
        dropdown.appendChild(option);
    }

    createOption(defaultOptionText, '');

    data.forEach(element => {
        createOption(element.name, element.name);
    });

    dropdown.addEventListener('change', function () {
        callback(this.value, index);
    });

    listElement.appendChild(dropdown);
    list.appendChild(listElement);
}

function withSign(value) {
    return `${value > 0 ? '+' : ''}${value}`
}