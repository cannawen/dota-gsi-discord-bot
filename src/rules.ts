/* eslint-disable sort-keys */
const assistant = {
    neutralItem: "assistant/neutral_item",
    roshan: {
        killedEvent: "assistant/roshan/killed_event/set_future_audio_state",
        maybeAliveTime: "assistant/roshan/maybe_alive_time/play_audio",
        aliveTime: "assistant/roshan/alive_time/play_audio",
        reset: "assistant/roshan/reset",
    },
    runes: "assistant/runes",
    pause: "assistant/pause",
    goldReminder: "assistant/gold_reminder",
    glhf: "assistant/glhf",
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
    heroAlive: "gsi/hero->alive",
    playerItems: "gsi/items->PlayerItems",
    map: {
        time: "gsi/map->time",
        inGame: "gsi/map->game_state",
        paused: "gsi/map->paused",
    },
    player: {
        gold: "gsi/player->gold",
    },
};

export default {
    assistant,
    discord,
    effect,
    gsi,
};
