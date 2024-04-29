import { Module } from "./module.js";

export class Ship {
    constructor(data) {
        this.name = data.name;
        this.healthPoints = data.healthPoints;
        this.shieldPoints = data.shieldPoints;
        this.shieldRecovery = data.shieldRecovery;
        this.gunSlots = data.gunSlots;
        this.moduleSlots = data.moduleSlots;
        this.guns = [];
        this.modules = [];
    }

    shieldRecoverReloadTime = 1;
    currentShieldRecoverReloadTime = 0;
    maxShieldPoints = 0;

    applyModules() {
        let resultModule = new Module('Result', 0, 0, 0, 0);

        this.modules.forEach(module => {
            if (module !== null) {
                resultModule.healthPoints += module.healthPoints;
                resultModule.shieldPoints += module.shieldPoints;
                resultModule.reloadSpeed += module.reloadSpeed;
                resultModule.shieldRecovery += module.shieldRecovery;
            }
        });

        this.healthPoints += resultModule.healthPoints;
        this.shieldPoints += resultModule.shieldPoints;

        this.guns.forEach(gun => {
            if (gun !== null) {
                gun.reloadTime += resultModule.reloadSpeed * gun.reloadTime;
            }
        });

        this.shieldRecovery += resultModule.shieldRecovery * this.shieldRecovery;

        this.maxShieldPoints = this.shieldPoints;
    }

    tryRecoverShield(deltaTime) {
        if (this.shieldPoints < this.maxShieldPoints) {
            if (this.currentShieldRecoverReloadTime <= 0) {
                this.currentShieldRecoverReloadTime = this.shieldRecoverReloadTime;

                this.shieldPoints += this.shieldRecovery;

                if (this.shieldPoints > this.maxShieldPoints) {
                    this.shieldPoints = this.maxShieldPoints;
                }

                return;
            }

            this.currentShieldRecoverReloadTime -= deltaTime;
        }
    }

    tryShoot(deltaTime) {
        let damage = 0;

        this.guns.forEach(gun => {
            if (gun !== null) {
                damage += gun.tryShoot(deltaTime);
            }
        });

        return damage;
    }

    applyDamage(damage) {
        let remainingDamage = damage;

        if (this.shieldPoints > 0) {
            this.shieldPoints -= remainingDamage;

            if (this.shieldPoints < 0) {
                remainingDamage = -1 * this.shieldPoints;
                this.shieldPoints = 0;
            }
            else {
                remainingDamage = 0;
            }
        }

        this.healthPoints -= remainingDamage;

        if (this.healthPoints < 0) {
            this.healthPoints = 0;
        }
    }
}