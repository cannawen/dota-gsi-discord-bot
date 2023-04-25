import fs from "fs";
import Item from "../gsi-data-classes/Item";
import path from "path";

/**
 * NOTE: This function only returns minutes and seconds
 * If the game lasts for over an hour, it will drop the "1 hour" portion of the time
 */
function secondsToTimeString(seconds: number) {
    const totalMs = seconds * 1000;

    const minutesAndSeconds = new Date(totalMs).toISOString().slice(14, 19);

    const removeLeadingZero = minutesAndSeconds.replace(/^0/, "");
    const timeStringWithSpaces = removeLeadingZero.replace(":", " ");

    return timeStringWithSpaces;
}

export const enum Tier {
    UNKNOWN = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export class NeutralItemHelper {
    public tierTimeInfo = [7, 17, 27, 37, 60];

    private tierToNameObject = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../resources/itemNeutralTier.json"),
            "utf8"
        )
    ) as { [key: string]: string[] };

    private nameToTierObject = Object.fromEntries(
        Object.entries(this.tierToNameObject)
            .map(([tier, items]) => items.map((item) => [item, parseInt(tier)]))
            .flat()
    ) as { [key: string]: Tier };

    public item = {
        philosophersStone: "item_philosophers_stone",
        pirateHat: "item_pirate_hat",
        trustyShovel: "item_trusty_shovel",
    };

    protected timeToTier(time: number): Tier {
        const index = this.tierTimeInfo
            .map((minute) => minute * 60)
            .map((s) => time < s)
            .findIndex((value) => value === true);
        if (index === -1) {
            return Tier.FIVE;
        } else {
            return index;
        }
    }

    protected nameToTier(name: string): Tier {
        return this.nameToTierObject[name] || Tier.UNKNOWN;
    }
    /**
     * To de-duplicate names in itemNeutralTier copied from https://dota2.fandom.com/wiki/Neutral_Items
     * const input = JSON.parse(fs.readFileSync(path.join("resources/itemNeutralTier.json"), "utf8"));
     * const output = JSON.stringify(Object.fromEntries(Object.entries(x).map(([k,v]) => [k, v.map((itemName) => itemName.slice(Math.ceil(itemName.length/2)))])))
     */
    public isItemAppropriateForTime(item: Item | null, time: number): boolean {
        if (item === null) {
            return false;
        }
        return true;
    }
}

export default {
    neutral: new NeutralItemHelper(),
    secondsToTimeString,
};
