import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";

const mockStartCoachingSession = jest.fn();
jest.mock("../../customEngine", () => ({
    startCoachingSession: mockStartCoachingSession,
}));

const mockDestroyConnection = jest.fn();
const mockJoinVoiceChannel = jest
    .fn()
    .mockReturnValue({ destroy: mockDestroyConnection });
jest.mock("@discordjs/voice", () => ({
    joinVoiceChannel: mockJoinVoiceChannel,
}));

import handle from "../handleSlashCommands";

const hashedStudentId = CryptoJS.HmacSHA256(
    "userId",
    process.env.STUDENT_ID_HASH_PRIVATE_KEY!
).toString();

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
            expect(mockReply).toHaveBeenCalledTimes(1);
            expect(mockReply.mock.lastCall[0].ephemeral).toBe(true);
        });

        test("calls engine.startCoachingSession with the proper params", () => {
            expect(mockStartCoachingSession).toHaveBeenCalledTimes(1);
            expect(mockStartCoachingSession.mock.lastCall[0]).toBe(
                hashedStudentId
            );
            expect(mockStartCoachingSession.mock.lastCall[1]).toBe("guildId");
            expect(mockStartCoachingSession.mock.lastCall[2]).toBe("channelId");
        });
    });

    describe("stop", () => {
        beforeEach(() => {
            handle.stop(interaction);
        });
        test("replies ephemerally", () => {
            expect(mockReply).toHaveBeenCalledTimes(1);
            expect(mockReply.mock.lastCall[0].ephemeral).toBe(true);
        });
        test("joins the voice channel", () => {
            expect(mockJoinVoiceChannel).toHaveBeenCalledTimes(1);
            expect(mockJoinVoiceChannel.mock.lastCall[0]).toEqual({
                adapterCreator: "voiceAdapterCreator",
                channelId: "channelId",
                guildId: "guildId",
            });
        });
        test("destroys the voice channel", () => {
            expect(mockDestroyConnection).toHaveBeenCalledTimes(1);
        });
    });

    test("config replies ephemerally", () => {
        handle.config(interaction);

        expect(mockReply).toHaveBeenCalledTimes(1);
        expect(mockReply.mock.lastCall[0].ephemeral).toBe(true);
    });

    test("help replies ephemerally", () => {
        handle.help(interaction);

        expect(mockReply).toHaveBeenCalledTimes(1);
        expect(mockReply.mock.lastCall[0].ephemeral).toBe(true);
    });
});
