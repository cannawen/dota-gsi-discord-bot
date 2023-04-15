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
    inGame: new Topic<boolean>("inGame"),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
    // player
    gold: new Topic<number>("gold"),
    // provider
    timestamp: new PersistentTopic<number>("timestamp", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
};

const effect = {
    playTts: new Topic<string>("playTts"),

    playPublicAudioFile: new Topic<string>("playPublicAudioFile"),
    publicAudioQueue: new Topic<DeepReadonly<string[]>>("publicAudioQueue"),

    playPrivateAudioFile: new Topic<string>("playPrivateAudioFile"),
    privateAudioQueue: new Topic<DeepReadonly<string[]>>("privateAudioQueue"),

    playInterruptingAudioFile: new Topic<string>("playInterruptingAudioFile"),

    stopAudio: new Topic<boolean>("stopAudio"),
};

const discord = {
    discordGuildId: new PersistentTopic<string>("discordGuildId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    discordGuildChannelId: new PersistentTopic<string>(
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
    // this is for if there are 2 people connected to the same voice channel
    discordAudioEnabled: new PersistentTopic<boolean>("discordAudioEnabled", {
        persistAcrossGames: true,
    }),
};

const allTopics = {
    studentId: new PersistentTopic<string>("studentId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    configUpdated: new Topic<boolean>("configUpdated"),
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
