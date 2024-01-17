import gsi from "node-gsi";

export default class Ability {
    public readonly name: string;
    public readonly cooldown: number;
    public readonly active: boolean;

    constructor(name: string, cooldown: number, active: boolean) {
        this.name = name;
        this.cooldown = cooldown;
        this.active = active;
    }

    static create(ability: gsi.IAbility) {
        return new Ability(
            ability.name,
            ability.cooldown,
            ability.abilityActive
        );
    }
}
