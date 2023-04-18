/* eslint-disable sort-keys */

// Cannot add a slash if we are sending the id over to front end
// Due to network thinking the slash is the start of a new route
const assistant = {
    buyback: {
        availability: "buyback/availability",
        warnNoBuyback: "buyback/warn_no_buyback",
    },
    glhf: "glhf",
    goldReminder: "gold_reminder",
    midas: "midas",
    neutralItemDigReminder: "neutral_item_dig_reminder",
    neutralItemReminder: "neutral_item_reminder",
    newNeutralItems: "new_neutral_items",
    pause: "pause",
    philosophersStone: "philosophersStone",
    roshan: {
        killedEvent: "roshan/killed_event/set_future_audio_state",
        maybeAliveTime: "roshan/maybe_alive_time/play_audio",
        aliveTime: "roshan/alive_time/play_audio",
    },
    runeBounty: "runeBounty",
    runePower: "runePower",
    runeWater: "runeWater",
    tome: "tome",
    wards: "wards",
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
