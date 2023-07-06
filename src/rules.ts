/* eslint-disable sort-keys */

// Cannot add a slash if we are sending the id over to front end
// Due to network thinking the slash is the start of a new route
// NOTE: IF YOU CHANGE THESE STRINGS WITHOUT MIGRATION
// ALL THE USER'S SAVED PREFERENCES WILL BE RESET
// SO MAYBE JUST NEVER CHANGE THESE STRINGS EVER AGAIN, MMMK?
const assistant = {
    buyback: "assistant-buyback",
    freeFortification: "assistant-free_fortification",
    glhf: "assistant-glhf",
    goldReminder: "assistant-gold",
    lotus: "assistant-lotus",
    midas: "assistant-midas",
    neutralItemDigReminder: "assistant-neutral_item-dig",
    neutralItemReminder: "assistant-neutral_item",
    newNeutralTokens: "assistant-new_neutral_tokens",
    pause: "assistant-pause",
    philosophersStone: "assistant-neutral_item-philosophers_stone_when_dead",
    randomItem: "assistant-random_item_suggestion",
    roshan: "assistant-roshan",
    runeBounty: "assistant-rune_bounty",
    runePower: "assistant-rune_power",
    runeWater: "assistant-rune_water",
    runeWisdom: "assistant-rune_wisdom",
    runeWisdomScan: "assistant-rune_wisdom_scan",
    shard: "assistant-shard",
    tormenter: "assistant-tormenter",
    tp: "assistant-tp",
    wards: "assistant-wards",
};

const discord = {
    playNext: "discord/play_next",
    startVoiceSubscription: "discord/startVoiceSubscription",
};

const effect = {
    playTts: "effect/playTts",
    playAudio: "effect/playAudio",
    playPrivateAudio: "effect/playPrivateAudio",
    playInterruptingAudio: "effect/playInterruptingAudio",
    stopAudio: "effect/stopAudio",
};

const gsi = {
    buildings: "gsi/buildings",
    events: {
        new: "gsi/events/new",
        reset: "gsi/events/reset_all",
    },
    hero: "gsi/hero",
    playerItems: "gsi/items->PlayerItems",
    map: "gsi/map",
    minimap: "gsi/minimap",
    player: "gsi/player",
    provider: "gsi/provider",
};

export default {
    assistant,
    discord,
    effect,
    gsi,
};
