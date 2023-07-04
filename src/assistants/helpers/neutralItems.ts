import fs from "fs";
import path from "path";

export const enum Tier {
    UNKNOWN = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    UNUSED_TOKEN = 6,
}

const tierTimeInfo = [7, 17, 27, 37, 60];

const tierToNameObject = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../../../resources/itemNeutralTier.json"),
        "utf8"
    )
) as { [key: string]: string[] };

const nameToTierObject = Object.fromEntries(
    Object.entries(tierToNameObject)
        .map(([tier, items]) => items.map((item) => [item, parseInt(tier)]))
        .flat()
) as { [key: string]: Tier };

function timeToTier(time: number): Tier {
    const index = tierTimeInfo
        .map((minute) => minute * 60)
        .map((seconds) => time < seconds)
        .findIndex((value) => value === true);
    if (index === -1) {
        return Tier.FIVE;
    } else {
        return index;
    }
}

function nameToTier(name: string): Tier {
    return nameToTierObject[name] || Tier.UNKNOWN;
}

function isItemAppropriateForTime(id: string | undefined, time: number) {
    // Having no neutral item is never appropriate
    if (id === undefined) {
        return false;
    }
    const itemTier = nameToTier(id);
    // Having an unused or unknown token is never appropriate
    if (itemTier === Tier.UNUSED_TOKEN || itemTier === Tier.UNKNOWN) {
        return false;
    }
    // Appropriate item when matching time tier or 1 below
    const timeTier = timeToTier(time);
    return itemTier >= timeTier - 1;
}

function isNeutralItem(name: string) {
    return nameToTier(name) !== Tier.UNKNOWN;
}

export default {
    tierTimeInfo,
    philosophersStone: "item_philosophers_stone",
    pirateHat: "item_pirate_hat",
    trustyShovel: "item_trusty_shovel",
    nameToTier,
    timeToTier,
    isItemAppropriateForTime,
    isNeutralItem,
};
