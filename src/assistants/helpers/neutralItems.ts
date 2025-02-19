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

const tierTimeInfo = [5, 15, 25, 35, 60, 70];

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

function isNeutralItem(name: string) {
    return nameToTier(name) !== Tier.UNKNOWN;
}

export default {
    tierTimeInfo,
    nameToTier,
    timeToTier,
    isNeutralItem,
};
