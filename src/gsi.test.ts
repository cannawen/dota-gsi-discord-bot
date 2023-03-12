/* eslint-disable no-extra-parens */
/* eslint-disable new-cap */
// eslint-disable-next-line @typescript-eslint/no-var-requires

jest.mock("dota2-gsi");
import d2gsi from "dota2-gsi";
import gsi from "./gsi";

function d2gsiMock(this: any, options?: any) {
    this.events = {
        on: jest.fn(),
    };
}

let serverMock : any = null;

describe("start of application", () => {
    beforeEach(() => {
        d2gsi.mockClear();
        serverMock = new (d2gsiMock as any)();
        d2gsi.mockImplementation(() => serverMock);
    });

    test("connect to Dota 2 Game State Integration server once", () => {
        gsi();
        expect(d2gsi).toHaveBeenCalledTimes(1);
    });

    test("listen to event emitter", () => {
        const mockServerEventsOn = serverMock.events.on;
        gsi();
        expect(mockServerEventsOn).toHaveBeenCalledTimes(1);
        // first parameter passed to server.events.on
        expect(mockServerEventsOn.mock.calls[0][0]).toBe("newclient");
        const mockNewClientEventOn = jest.fn();
        // second parameter passed to server.events.on
        mockServerEventsOn.mock.calls[0][1]({
            ip: 3,
            on: mockNewClientEventOn,
        });

        expect(mockNewClientEventOn.mock.calls[0][0]).toBe("map:clock_time");
    });
});
