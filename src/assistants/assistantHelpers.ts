import fs from "fs";
import path from "path";

/**
 * NOTE: This function only returns minutes and seconds
 * If the game lasts for over an hour, it will drop the "1 hour" portion of the time
 */
function secondsToTimeString(seconds: number, formatTts?: boolean) {
    const totalMs = seconds * 1000;

    const minutesAndSeconds = new Date(totalMs).toISOString().slice(14, 19);

    if (formatTts) {
        return minutesAndSeconds.replace(/^0/, "").replace(":", " ");
    } else {
        return minutesAndSeconds;
    }
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

    /**
     * To de-duplicate names in itemNeutralTier copied from https://dota2.fandom.com/wiki/Neutral_Items
     * const input = JSON.parse(fs.readFileSync(path.join("resources/itemNeutralTier.json"), "utf8"));
     * const output = JSON.stringify(Object.fromEntries(Object.entries(x).map(([k,v]) => [k, v.map((itemName) => itemName.slice(Math.ceil(itemName.length/2)))])))
     */
    /**
     * To turn names into ids (mostly)
     * const namesToId = Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(path.join("resources/items.json"), "utf8"))).map((a) => a.reverse())) as { [key: string]: string };
     * const input = JSON.parse(fs.readFileSync(path.join("resources/itemNeutralTier.json"), "utf8")) as { [key: string]: string[] };
     * const output = JSON.stringify(Object.fromEntries(Object.entries(input).map(([k, v]) => [k,v.map((itemName) => namesToId[itemName] || itemName),])));
     */
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

    public timeToTier(time: number): Tier {
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

    public nameToTier(name: string): Tier {
        return this.nameToTierObject[name] || Tier.UNKNOWN;
    }

    public isItemAppropriateForTime(id: string | undefined, time: number) {
        // Having no neutral item is never appropriate
        if (id === undefined) {
            return false;
        }
        const itemTier = this.nameToTier(id);
        // Having an unclassified neutral item is always appropriate
        // This is probably a data issue on our end
        if (itemTier === Tier.UNKNOWN) {
            return true;
        }
        // Appropriate item when matching time tier or 1 below
        const timeTier = this.timeToTier(time);
        return itemTier >= timeTier - 1;
    }
}

export default {
    neutral: new NeutralItemHelper(),
    secondsToTimeString,
};
