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
    alive: new Topic<boolean>("alive"),
    events: new Topic<Event[]>("events"),
    gsiData: new Topic<GsiData>("gsiData"),
    inGame: new Topic<boolean>("inGame"),
    items: new Topic<PlayerItems>("items"),
    playAudioFile: new Topic<string>("playAudioFile"),
    playTts: new Topic<string>("playTts"),
    time: new Topic<number>("time"),
};
