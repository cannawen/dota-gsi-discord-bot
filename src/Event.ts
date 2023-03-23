import gsi from "node-gsi";

/**
 * This matches the definition from node-gsi
 */
export enum EventType {
    AegisPickedUp = "aegis_picked_up",
    BountyRunePickedUp = "bounty_rune_pickup",
    RoshanKilled = "roshan_killed",
    AegisDenied = "aegis_denied",
    Tip = "tip",
    BountyPickup = "bounty_rune_pickup",
    CourierKilled = "courier_killed",
}

export default class Event {
    type: EventType;
    time: number;

    /**
     *
     * @param type EventType
     * @param time This is "map.game_time" which differs from "map.clock_time" that is being used throughout the app
     */
    constructor(type: EventType, time: number) {
        this.type = type;
        this.time = time;
    }

    static create(event: gsi.IEvent) {
        return new Event(event.eventType, event.gameTime);
    }
}
