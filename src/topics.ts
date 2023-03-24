import Event from "./Event";
import GsiData from "./gsi/GsiData";
import PlayerItems from "./PlayerItems";
import { Topic } from "./Engine";

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
