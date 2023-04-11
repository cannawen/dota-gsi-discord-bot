import gsi from "node-gsi";

/**
 * This matches the definition from node-gsi
 */
// eslint-disable-next-line no-shadow
export const enum EventType {
    AegisPickedUp = "aegis_picked_up",
    BountyRunePickup = "bounty_rune_pickup",
    RoshanKilled = "roshan_killed",
    AegisDenied = "aegis_denied",
    Tip = "tip",
    CourierKilled = "courier_killed",
}

export default class Event {
    public readonly type: EventType;
    public readonly time: number;

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
        return new Event(
            event.eventType as unknown as EventType,
            event.gameTime
        );
    }
}
