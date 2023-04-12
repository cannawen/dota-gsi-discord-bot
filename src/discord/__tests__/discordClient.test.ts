jest.mock("../../log");

const mockConfig = jest.fn();
const mockCoachMe = jest.fn();
const mockStop = jest.fn();
const mockHelp = jest.fn();

jest.mock("../handleSlashCommands", () => ({
    config: mockConfig,
    coachMe: mockCoachMe,
    stop: mockStop,
    help: mockHelp,
}));

const mockLogin = jest.fn().mockImplementation(() => ({
    catch: jest.fn(),
}));
const mockOn = jest.fn();
const mockOnce = jest.fn();

jest.mock("discord.js", () => ({
    Client: jest.fn().mockImplementation(() => ({
        guilds: {
            cache: [
                {
                    id: "guildId",
                    name: "Guild Name",
                    channels: {
                        cache: [
                            { id: "channelId", name: "Channel Name" },
                            { id: "1" },
                        ],
                    },
                },
                { id: "2" },
            ],
        },
        login: mockLogin,
        on: mockOn,
        once: mockOnce,
    })),
    Events: {
        ClientReady: "ClientReady",
        Error: "Error",
        InteractionCreate: "InteractionCreate",
    },
}));

import Discord from "discord.js";
import { DiscordClient } from "../discordClient";

describe("client", () => {
    const OLD_ENV = process.env;

    let sut: DiscordClient;
    beforeEach(() => {
        sut = new DiscordClient();
    });

    beforeAll(() => {
        process.env = { ...OLD_ENV, DISCORD_BOT_TOKEN: "test" };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test("Create new discord client", () => {
        expect(Discord.Client).toHaveBeenCalledTimes(1);
    });

    test("Logs in with bot token", () => {
        sut.start();
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockLogin.mock.lastCall[0]).toBe("test");
    });

    describe("interactions", () => {
        let handleInteraction: (interaction: any) => void;

        beforeEach(() => {
            sut.start();
            handleInteraction = mockOn.mock.calls[0][1];
        });
        test("Sets up interactions", () => {
            sut.start();
            expect(mockOn.mock.calls[0][0]).toEqual("InteractionCreate");
        });
        test("config command is handled", () => {
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "config",
            };
            handleInteraction(interaction);
            expect(mockConfig).toHaveBeenCalledTimes(1);
            expect(mockConfig.mock.lastCall[0]).toBe(interaction);
        });
        test("coachme command is handled", () => {
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "coachme",
            };
            handleInteraction(interaction);
            expect(mockCoachMe).toHaveBeenCalledTimes(1);
            expect(mockCoachMe.mock.lastCall[0]).toBe(interaction);
        });
        test("stop command is handled", () => {
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "stop",
            };
            handleInteraction(interaction);
            expect(mockStop).toHaveBeenCalledTimes(1);
            expect(mockStop.mock.lastCall[0]).toBe(interaction);
        });
        test("help command is handled", () => {
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "help",
            };
            handleInteraction(interaction);
            expect(mockHelp).toHaveBeenCalledTimes(1);
            expect(mockHelp.mock.lastCall[0]).toBe(interaction);
        });
        test("unknown command sends ephemeral reply back to user", () => {
            const mockReply = jest.fn();
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "unknown",
                reply: mockReply,
            };
            handleInteraction(interaction);
            expect(mockReply).toHaveBeenCalledTimes(1);
            expect(mockReply.mock.lastCall[0].ephemeral).toBe(true);
        });
    });

    test("find channel", () => {
        const channel = sut.findChannel("guildId", "channelId");
        expect(channel).toEqual({ id: "channelId", name: "Channel Name" });
    });
});
