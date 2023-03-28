class FakeGSIServer {
    events = { on: jest.fn() };

    listen = jest.fn();
}

export const Dota2GSIServer = FakeGSIServer;

export const Dota2Event = {
    Dota2ObserverState: "dota2-observer-state",
    Dota2State: "dota2-state",
};
