import { Data } from './modules/data.js'
import { display } from './modules/ui.js';
import { updateShipsDisplay } from './modules/ui.js';

const deltaTime = 1 / 60;
const intervalTime = 1000 * deltaTime;

const data = new Data();
var battleResult;

await data.initialize();

display(data, startBattle);

function startBattle() {
    let firstShip = data.firstShip;
    let secondShip = data.secondShip;

    firstShip.applyModules();
    secondShip.applyModules();

    updateShipsDisplay(firstShip, secondShip);

    const interval = setInterval(() => {
        firstShip.tryRecoverShield(deltaTime);
        secondShip.tryRecoverShield(deltaTime);

        secondShip.applyDamage(firstShip.tryShoot(deltaTime));
        firstShip.applyDamage(secondShip.tryShoot(deltaTime));

        updateShipsDisplay(firstShip, secondShip);

        if (data.firstShip.healthPoints <= 0 || data.secondShip.healthPoints <= 0) {
            clearInterval(interval);
            updateShipsDisplay(firstShip, secondShip);

            if (firstShip.healthPoints == secondShip.healthPoints) {
                battleResult = 'Ничья.';
            }
            else if (firstShip.healthPoints <= 0) {
                battleResult = `Победил ${secondShip.name}.`;
            }
            else if (secondShip.healthPoints <= 0) {
                battleResult = `Победил ${firstShip.name}.`;
            }

            setTimeout(battleEnded, intervalTime);
        }
    }, intervalTime);
}

function battleEnded() {
    confirm(`Бой завершен. ${battleResult}`);
    location.reload();
}