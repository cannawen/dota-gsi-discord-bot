import gsi from "node-gsi";

export default class Ability {
    public readonly name: string;
    public readonly cooldown: number;

    constructor(name: string, cooldown: number) {
        this.name = name;
        this.cooldown = cooldown;
    }

    static create(ability: gsi.IAbility) {
        return new Ability(ability.name, ability.cooldown);
    }
}
