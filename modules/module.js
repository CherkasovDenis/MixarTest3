export class Module {
    constructor(name, healthPoints, shieldPoints, reloadSpeed, shieldRecovery) {
        this.name = name;
        this.healthPoints = healthPoints;
        this.shieldPoints = shieldPoints;
        this.reloadSpeed = reloadSpeed;
        this.shieldRecovery = shieldRecovery;
    }
}