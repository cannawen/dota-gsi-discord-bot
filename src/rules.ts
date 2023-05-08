/* eslint-disable sort-keys */

// Cannot add a slash if we are sending the id over to front end
// Due to network thinking the slash is the start of a new route
const assistant = {
    buyback: "assistant-buyback",
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
    runeBounty: "assistant-rune-bounty",
    runePower: "assistant-rune-power",
    runeWater: "assistant-rune-water",
    runeWisdom: "assistant-rune-wisdom",
    shard: "assistant-shard",
    tormenter: "assistant-tormenter",
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
    events: {
        new: "gsi/events/new",
        reset: "gsi/events/reset_all",
    },
    hero: "gsi/hero",
    playerItems: "gsi/items->PlayerItems",
    map: "gsi/map",
    player: "gsi/player",
    provider: "gsi/provider",
};

export default {
    assistant,
    discord,
    effect,
    gsi,
};
