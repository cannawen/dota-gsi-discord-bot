jest.mock("../../log");
jest.mock("../../customEngine");
jest.mock("@discordjs/voice");

import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";
import engine from "../../customEngine";
import handle from "../handleSlashCommands";
import Voice from "@discordjs/voice";

describe("handleSlashCommands", () => {
    let interaction: ChatInputCommandInteraction<CacheType>;
    let mockReply: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockReply = jest.fn();
        interaction = {
            channel: {
                isVoiceBased: () => true,
            },
            channelId: "channelId",
            guild: {
                id: "guildId",
                voiceAdapterCreator: "voiceAdapterCreator",
            },
            guildId: "guildId",
            user: { id: "userId" },
            reply: mockReply,
        } as unknown as ChatInputCommandInteraction<CacheType>;
    });

    describe("coachMe", () => {
        beforeEach(() => {
            handle.coachMe(interaction);
        });
        test("replies ephemerally", () => {
            expect(mockReply).toHaveBeenCalledWith({
                content: expect.stringContaining("Starting..."),
                ephemeral: true,
            });
        });

        test("calls engine.startCoachingSession with the proper params", () => {
            const hashedStudentId = CryptoJS.HmacSHA256(
                "userId",
                "test_STUDENT_ID_HASH_PRIVATE_KEY"
            ).toString();

            expect(engine.startCoachingSession).toHaveBeenCalledWith(
                hashedStudentId,
                "guildId",
                "channelId"
            );
        });
    });

    describe("stop", () => {
        beforeEach(() => {
            handle.stop(interaction);
        });
        test("replies ephemerally", () => {
            expect(mockReply).toHaveBeenCalledWith({
                content: expect.anything(),
                ephemeral: true,
            });
        });
        test("joins the voice channel", () => {
            expect(Voice.joinVoiceChannel).toHaveBeenCalledWith({
                adapterCreator: "voiceAdapterCreator",
                channelId: "channelId",
                guildId: "guildId",
            });
        });
        test("destroys the voice channel", () => {
            const mockVoice = Voice.joinVoiceChannel as jest.Mock;
            const spyDestroy = jest.spyOn(
                mockVoice.mock.results[0].value as any,
                "destroy"
            );
            expect(spyDestroy).toHaveBeenCalledTimes(1);
        });
    });

    test("config replies ephemerally", () => {
        handle.config(interaction);

        expect(mockReply).toHaveBeenCalledWith({
            content: expect.anything(),
            ephemeral: true,
        });
    });

    test("help replies ephemerally", () => {
        handle.help(interaction);

        expect(mockReply).toHaveBeenCalledWith({
            content: expect.anything(),
            ephemeral: true,
        });
    });
});
