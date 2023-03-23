import Event from "./Event";
import PlayerItems from "./PlayerItems";
import { Topic } from "./Engine";
import GsiData from "./gsi/GsiData";

/**
 * These are topics that cross different modules
 * A module may still choose to store a locally owned topic
 * that no one else needs to know about,
 * in which case it can be declared inside the module
 */
export default {
    gsiData: new Topic<GsiData>("gsiData"),
    time: new Topic<number | undefined>("time"),
    items: new Topic<PlayerItems | undefined>("items"),
    inGame: new Topic<boolean | undefined>("inGame"),
    events: new Topic<Event[] | undefined>("events"),
    playAudioFile: new Topic<string | undefined>("playAudioFile"),
    playTts: new Topic<string | undefined>("playTts"),
};
