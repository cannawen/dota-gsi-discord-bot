/* eslint-disable sort-keys */
import { DeepReadonly } from "ts-essentials";
import Event from "./gsi-data-classes/Event";
import GsiData from "./gsi/GsiData";
import PlayerItems from "./gsi-data-classes/PlayerItems";
import Topic from "./engine/Topic";
import Voice from "@discordjs/voice";

const gsiData = {
    gsiData: new Topic<DeepReadonly<GsiData>>("gsiData"),
};

const gsi = {
    alive: new Topic<boolean>("alive"),
    events: new Topic<DeepReadonly<Event[]>>("events"),
    inGame: new Topic<boolean>("inGame"),
    items: new Topic<DeepReadonly<PlayerItems>>("items"),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
};

const effects = {
    playTts: new Topic<string>("playTts"),
    playAudioFile: new Topic<string>("playAudioFile"),
    audioQueue: new Topic<DeepReadonly<string[]>>("discordAudioQueue"),
    playPrivateAudioFile: new Topic<string>("playPrivateAudioFile"),
    privateAudioQueue: new Topic<DeepReadonly<string[]>>("privateAudioQueue"),
};

const discord = {
    discordGuildId: new Topic<string>("registerDiscordGuild"),
    discordGuildChannelId: new Topic<string>("registerDiscordGuildChannel"),
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
    studentId: new Topic<string>("studentId"),
    ...gsiData,
    ...effects,
    ...gsi,
    ...discord,
};
