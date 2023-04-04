/* eslint-disable sort-keys */
import { DeepReadonly } from "ts-essentials";
import Event from "./gsi-data-classes/Event";
import GsiData from "./gsi/GsiData";
import PlayerItems from "./gsi-data-classes/PlayerItems";
import Topic from "./engine/Topic";
import Voice from "@discordjs/voice";

const gsi = {
    allData: new Topic<DeepReadonly<GsiData>>("allData"),

    // events
    events: new Topic<DeepReadonly<Event[]>>("events"),
    // hero
    alive: new Topic<boolean>("alive"),
    // items
    items: new Topic<DeepReadonly<PlayerItems>>("items"),
    // map
    inGame: new Topic<boolean>("inGame"),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
    // player
    gold: new Topic<number>("gold"),
    buybackCost: new Topic<number>("buybackCost"),
    buybackCooldown: new Topic<number>("buybackCooldown"),
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
    discordGuildId: new Topic<string>("registerDiscordGuild", true),
    discordGuildChannelId: new Topic<string>(
        "registerDiscordGuildChannel",
        true
    ),
    // playing audio
    discordReadyToPlayAudio: new Topic<boolean>("discordReadyToPlayAudio"),
    discordSubscriptionTopic: new Topic<Voice.PlayerSubscription>(
        "discordSubscriptionTopic"
    ),
};

/**
 * These are topics that cross different modules
 * A module may still choose to store a locally owned topic
 * that no one else needs to know about,
 * in which case it can be declared inside the module
 */
export default {
    studentId: new Topic<string>("studentId", true),
    configUpdated: new Topic<boolean>("configUpdated"),
    ...effect,
    ...gsi,
    ...discord,
};
