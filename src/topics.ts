import Event from "./Event";
import GsiData from "./gsi/GsiData";
import PlayerItems from "./PlayerItems";
import { Topic } from "./Engine";

/**
 * These are topics that cross different modules
 * A module may still choose to store a locally owned topic
 * that no one else needs to know about,
 * in which case it can be declared inside the module
 */
export default {
    alive: new Topic<boolean | undefined>("alive"),
    events: new Topic<Event[] | undefined>("events"),
    gsiData: new Topic<GsiData>("gsiData"),
    inGame: new Topic<boolean | undefined>("inGame"),
    items: new Topic<PlayerItems | undefined>("items"),
    playAudioFile: new Topic<string | undefined>("playAudioFile"),
    playTts: new Topic<string | undefined>("playTts"),
    time: new Topic<number | undefined>("time"),
};
