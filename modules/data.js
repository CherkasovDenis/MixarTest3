import { Ship } from './ship.js'
import { Module } from './module.js'
import { Gun } from './gun.js'

export class Data {
    firstShip;
    secondShip;
    modules = [];
    guns = [];

    async initialize() {
        await fetch('./data/ShipA.json')
            .then(res => res.json())
            .then(data => {
                this.firstShip = new Ship(data);
            });

        await fetch('./data/ShipB.json')
            .then(res => res.json())
            .then(data => {
                this.secondShip = new Ship(data);
            });

        await fetch('./data/Modules.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(module => {
                    this.modules.push(new Module(module.name, module.healthPoints,
                        module.shieldPoints, module.reloadSpeed, module.shieldRecovery));
                });
            });

        await fetch('./data/Guns.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(gun => {
                    this.guns.push(new Gun(gun.name, gun.reloadTime, gun.damage));
                });
            });
    }
}