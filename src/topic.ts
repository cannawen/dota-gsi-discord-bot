import Event from "./classes/data/Event";
import GsiData from "./gsi/GsiData";
import PlayerItems from "./classes/data/PlayerItems";
import Topic from "./classes/engine/Topic";

const gsiData = {
    gsiData: new Topic<GsiData>("gsiData"),
};

const gsi = {
    alive: new Topic<boolean>("alive"),
    events: new Topic<Event[]>("events"),
    inGame: new Topic<boolean>("inGame"),
    items: new Topic<PlayerItems>("items"),
    time: new Topic<number>("time"),
};

const effects = {
    playAudioFile: new Topic<string>("playAudioFile"),
    playTts: new Topic<string>("playTts"),
};

const discord = {
    discordBotSecret: new Topic<string>("registerDiscordBotSecret"),
    discordGuildId: new Topic<string>("registerDiscordGuild"),
    discordGuildChannelId: new Topic<string>("registerDiscordGuildChannel"),

    discordReadyToPlayAudio: new Topic<boolean>("discordReadyToPlayAudio"),
    discordAudioQueue: new Topic<string[]>("discordAudioQueue"),
};

/**
 * These are topics that cross different modules
 * A module may still choose to store a locally owned topic
 * that no one else needs to know about,
 * in which case it can be declared inside the module
 */
export default {
    ...gsiData,
    ...effects,
    ...gsi,
    ...discord,
};
