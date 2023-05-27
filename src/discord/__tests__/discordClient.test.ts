jest.mock("../../log");
jest.mock("discord.js");
jest.mock("fs");

import Discord from "discord.js";
import { DiscordClient } from "../discordClient";

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
        let handleInteraction: (interaction: any) => any;

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

        test("unknown command sends ephemeral reply back to user", () => {
            const mockReply = jest.fn();
            const interaction = {
                isChatInputCommand: () => true,
                commandName: "unknown",
                reply: mockReply,
            };
            handleInteraction(interaction);
            expect(mockReply).toHaveBeenCalledWith({
                content: expect.stringContaining(
                    "Unable to handle command unknown."
                ),
                ephemeral: true,
            });
        });
    });

    test("find channel", () => {
        const channel = sut.findChannel("guildId", "channelId");
        expect(channel?.id).toEqual("channelId");
    });
});
