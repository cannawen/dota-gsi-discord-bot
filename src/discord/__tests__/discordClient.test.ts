jest.mock("../../log");
jest.mock("../handleSlashCommands");
jest.mock("discord.js");

import Discord from "discord.js";
import { DiscordClient } from "../discordClient";
import handleSlashCommands from "../handleSlashCommands";

describe("client", () => {
    let sut: DiscordClient;
    let spyClient: any;

    beforeEach(() => {
        spyClient = jest.spyOn(Discord, "Client");
        sut = new DiscordClient();
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
        expect(spyLogin).toHaveBeenCalledWith("test_DISCORD_BOT_TOKEN");
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
            expect(spyOn).toHaveBeenCalledWith(
                "InteractionCreate",
                expect.anything()
            );
        });
        test("config command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "config");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "config",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledWith(interaction);
        });
        test("coachme command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "coachMe");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "coachme",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledWith(interaction);
        });
        test("stop command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "stop");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "stop",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledWith(interaction);
        });
        test("help command is handled", () => {
            const spy = jest.spyOn(handleSlashCommands, "help");
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "help",
            };
            handleInteraction(interaction);
            expect(spy).toHaveBeenCalledWith(interaction);
        });
        test("unknown command sends ephemeral reply back to user", () => {
            const mockReply = jest.fn();
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "unknown",
                reply: mockReply,
            };
            handleInteraction(interaction);
            expect(mockReply).toHaveBeenCalledWith({
                content:
                    "Unable to handle command unknown. Please try again later",
                ephemeral: true,
            });
        });
    });

    test("find channel", () => {
        const channel = sut.findChannel("guildId", "channelId");
        expect(channel?.id).toEqual("channelId");
    });
});
