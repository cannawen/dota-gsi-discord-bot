/* eslint-disable sort-keys */
import { DeepReadonly } from "ts-essentials";
import Event from "./gsi-data-classes/Event";
import GsiData from "./gsi/GsiData";
import manager from "./engine/topicManager";
import PersistentTopic from "./engine/PersistentTopic";
import PlayerItems from "./gsi-data-classes/PlayerItems";
import Topic from "./engine/Topic";
import Voice from "@discordjs/voice";

const gsi = {
    allData: new Topic<DeepReadonly<GsiData>>("allData"),

    // events
    events: new Topic<DeepReadonly<Event[]>>("events"),
    // hero
    alive: new Topic<boolean>("alive"),
    buybackCost: new Topic<number>("buybackCost"),
    buybackCooldown: new Topic<number>("buybackCooldown"),
    respawnSeconds: new Topic<number>("respawnSeconds"),
    // items
    items: new Topic<DeepReadonly<PlayerItems>>("items"),
    // map
    dayTime: new Topic<boolean>("dayTime"),
    inGame: new Topic<boolean>("inGame"),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
    // player
    gold: new Topic<number>("gold"),
    // provider
    // Also set when we create a new coaching session
    timestamp: new PersistentTopic<number>("timestamp", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
};

/**
 * playPublicAudio and playPrivateAudio take in either
 * 1) A hardcoded file in ./resources/audio/ directory
 * 2) A message that will be TTS-ed and saved to ./resources/audio/tts-cache/
 */
const effect = {
    // This is used as a temporary topic to be swap out by rule decorator configurable
    effect: new Topic<string>("effect"),

    playPublicAudio: new Topic<string>("playPublicAudio"),
    publicAudioQueue: new Topic<DeepReadonly<string[]>>("publicAudioQueue"),

    playPrivateAudio: new Topic<string>("playPrivateAudio"),
    privateAudioQueue: new Topic<DeepReadonly<string[]>>("privateAudioQueue"),

    playInterruptingAudioFile: new Topic<string>("playInterruptingAudioFile"),

    stopAudio: new Topic<boolean>("stopAudio"),
};

const discord = {
    discordGuildId: new PersistentTopic<string | null>("discordGuildId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    discordGuildChannelId: new PersistentTopic<string | null>(
        "discordGuildChannelId",
        {
            persistAcrossGames: true,
            persistAcrossRestarts: true,
        }
    ),
    // playing audio
    discordReadyToPlayAudio: new PersistentTopic<boolean>(
        "discordReadyToPlayAudio",
        {
            persistAcrossGames: true,
        }
    ),
    discordSubscriptionTopic: new PersistentTopic<Voice.PlayerSubscription>(
        "discordSubscriptionTopic",
        {
            persistAcrossGames: true,
        }
    ),
    discordAudioEnabled: new PersistentTopic<boolean>("discordAudioEnabled", {
        persistAcrossGames: true,
    }),
    lastDiscordUtterance: new Topic<string>("lastDiscordUtterance"),
};

const allTopics = {
    studentId: new PersistentTopic<string>("studentId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    updateFrontend: new Topic<boolean>("updateFrontend"),
    ...effect,
    ...gsi,
    ...discord,
};

Object.values(allTopics).forEach((topic) => manager.registerTopic(topic));

/**
 * These are topics that cross different modules
 * A module may still choose to store a locally owned topic
 * that no one else needs to know about,
 * in which case it can be declared inside the module
 * BUT IT STILL NEEDS TO BE REGISTERED TO BE PERSISTED PROPERLY
 */
export default {
    ...allTopics,
};
