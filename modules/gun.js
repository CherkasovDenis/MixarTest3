export class Gun {
    constructor(name, reloadTime, damage) {
        this.name = name;
        this.reloadTime = reloadTime;
        this.damage = damage;
    }

    currentReloadTime = 0;

    tryShoot(deltaTime) {
        if (this.currentReloadTime <= 0) {
            this.currentReloadTime = this.reloadTime;
            return this.damage;
        }

        this.currentReloadTime -= deltaTime;

        return 0;
    }
}