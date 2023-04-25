import Item from "../gsi-data-classes/Item";

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

const enum Tier {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

class NeutralItemHelper {
    public tierTimeInfo = {
        [Tier.ONE]: 7,
        [Tier.TWO]: 17,
        [Tier.THREE]: 27,
        [Tier.FOUR]: 37,
        [Tier.FIVE]: 60,
    };
    public item = {
        philosophersStone: "item_philosophers_stone",
        pirateHat: "item_pirate_hat",
        trustyShovel: "item_trusty_shovel",
    };
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
