import Event from "./Event";
import PlayerItems from "./PlayerItems";
import { Topic } from "./Engine";
import GsiData from "./gsi/GsiData";

export default {
    gsiData: new Topic<GsiData>("gsiData"),
    time: new Topic<number | undefined>("time"),
    items: new Topic<PlayerItems | undefined>("items"),
    inGame: new Topic<boolean | undefined>("inGame"),
    events: new Topic<Event[] | undefined>("events"),
    // event_message: new Topic<string>("event_message"),
    playAudioFile: new Topic<string | undefined>("playAudioFile"),
};