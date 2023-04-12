jest.mock("../../log");
jest.mock("../handleSlashCommands");
jest.mock("discord.js");

import Discord from "discord.js";
import { DiscordClient } from "../discordClient";
import handleSlashCommands from "../handleSlashCommands";

describe("client", () => {
    const OLD_ENV = process.env;

    let sut: DiscordClient;
    let spyClient: any;

    beforeEach(() => {
        spyClient = jest.spyOn(Discord, "Client");
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
        const spyLogin = jest.spyOn(
            spyClient.mock.results[0].value as any,
            "login"
        );
        sut.start();
        expect(spyLogin).toHaveBeenCalledTimes(1);
        expect(spyLogin.mock.lastCall![0]).toBe("test");
    });

    describe("interactions", () => {
        let handleInteraction: (interaction: any) => void;

        let spyOn: any;
        beforeEach(() => {
            spyOn = jest.spyOn(spyClient.mock.results[0].value as any, "on");
            sut.start();
            handleInteraction = spyOn.mock.calls[0][1];
        });
        test("Sets up interactions", () => {
            sut.start();
            expect(spyOn.mock.calls[0][0]).toEqual("InteractionCreate");
        });
        test("config command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "config");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "config",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.lastCall![0]).toBe(interaction);
        });
        test("coachme command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "coachMe");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "coachme",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.lastCall![0]).toBe(interaction);
        });
        test("stop command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "stop");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "stop",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.lastCall![0]).toBe(interaction);
        });
        test("help command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "help");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "help",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.lastCall![0]).toBe(interaction);
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
        expect(channel?.id).toEqual("channelId");
    });
});
