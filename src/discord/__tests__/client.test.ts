import Discord from "discord.js";
// jest.mock("discord.js", () => jest.fn());

const mockLogin = jest.fn().mockImplementation(() => ({
    catch: jest.fn(),
}));
const mockOn = jest.fn();
const mockOnce = jest.fn();

jest.mock("discord.js", () => ({
    Client: jest.fn().mockImplementation(() => ({
        login: mockLogin,
        on: mockOn,
        once: mockOnce,
    })),
    Events: jest.fn(),
}));
import { DiscordClient } from "../client";

describe("client", () => {
    let sut: DiscordClient;
    beforeEach(() => {
        (Discord.Client as unknown as jest.Mock).mockClear();
        (Discord.Events as unknown as jest.Mock).mockClear();
        mockLogin.mockClear();
        mockOn.mockClear();
        mockOnce.mockClear();
        sut = new DiscordClient();
        sut.start();
    });

    test("Create new discord client", () => {
        expect(Discord.Client).toHaveBeenCalledTimes(1);
    });
});
