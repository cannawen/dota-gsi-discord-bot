jest.mock("@discordjs/voice");
jest.mock("../../log");
jest.mock("../../customEngine");
jest.mock("../discordHelpers");

import CryptoJS from "crypto-js";
import engine from "../../customEngine";
import handle from "../handleSlashCommands";
import helpers from "../discordHelpers";

const STUDENT_ID = CryptoJS.HmacSHA256(
    "userId",
    "test_STUDENT_ID_HASH_PRIVATE_KEY"
).toString();

describe("handleSlashCommands", () => {
    let interaction: any;
    let mockReply: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockReply = jest.fn();
        interaction = {
            channelId: "channelId",
            guild: {
                id: "guildId",
                voiceAdapterCreator: "voiceAdapterCreator",
            },
            channel: {
                isVoiceBased: () => true,
            },
            guildId: "guildId",
            user: { id: "userId" },
            reply: mockReply,
        };
    });

    describe("coachMe", () => {
        describe("does not currently have a coaching session", () => {
            beforeEach(() => {
                (engine.getSession as jest.Mock).mockReturnValue(undefined);
            });
            describe("bot is started in a voice based channel with a guildId", () => {
                describe("no one else connected to channel", () => {
                    beforeEach(() => {
                        (
                            helpers.numberOfPeopleConnected as jest.Mock
                        ).mockReturnValue(0);
                        handle.coachMe(interaction);
                    });
                    test("replies affirmation ephemerally", () => {
                        expect(mockReply).toHaveBeenCalledWith({
                            content: expect.stringContaining("Starting..."),
                            ephemeral: true,
                        });
                    });
                    test("calls engine.startCoachingSession with the proper params", () => {
                        expect(
                            engine.startCoachingSession
                        ).toHaveBeenCalledWith(
                            STUDENT_ID,
                            "guildId",
                            "channelId"
                        );
                    });
                });
                describe("someone else connected to channel", () => {
                    beforeEach(() => {
                        (
                            helpers.numberOfPeopleConnected as jest.Mock
                        ).mockReturnValue(1);
                        handle.coachMe(interaction);
                    });
                    test("calls engine.startCoachingSession with the proper params", () => {
                        expect(
                            engine.startCoachingSession
                        ).toHaveBeenCalledWith(STUDENT_ID);
                    });
                });
            });
            describe("bot is started in a non voice-based channe or without guildId", () => {
                beforeEach(() => {
                    handle.coachMe({
                        ...interaction,
                        channel: {
                            isVoiceBased: () => false,
                        },
                        guildId: undefined,
                    });
                });
                test("replies affirmation ephemerally", () => {
                    expect(mockReply).toHaveBeenCalledWith({
                        content: expect.stringContaining("WARNING"),
                        ephemeral: true,
                    });
                });
                test("calls engine.startCoachingSession with the proper params", () => {
                    expect(engine.startCoachingSession).toHaveBeenCalledWith(
                        STUDENT_ID
                    );
                });
            });
        });
        describe("has a coaching session", () => {
            beforeEach(() => {
                (engine.getSession as jest.Mock).mockReturnValue(jest.fn());
                handle.coachMe(interaction);
            });
            test("replies with error ephemerally", () => {
                expect(mockReply).toHaveBeenCalledWith({
                    content: expect.stringContaining(
                        "You already have a coaching session"
                    ),
                    ephemeral: true,
                });
            });
        });
    });

    describe("stop", () => {
        describe("user has a coaching session", () => {
            beforeEach(() => {
                (engine.getSession as jest.Mock).mockReturnValue(jest.fn());
                handle.stop(interaction);
            });
            test("should tell engine to delete session", () => {
                expect(engine.deleteSession).toHaveBeenCalledWith(STUDENT_ID);
            });
            test("notifies user coaching session is ending", () => {
                expect(mockReply).toHaveBeenCalledWith({
                    content: "Ending your coaching session...",
                    ephemeral: true,
                });
            });
        });
        describe("user does not have a coaching session", () => {
            beforeEach(() => {
                (engine.getSession as jest.Mock).mockReturnValue(undefined);
                handle.stop(interaction);
            });
            test("tried to find current user's coaching session", () => {
                expect(engine.getSession).toHaveBeenCalledWith(STUDENT_ID);
            });
            test("notifies user they have no coaching session", () => {
                expect(mockReply).toHaveBeenCalledWith({
                    content: "You are not currently in a coaching session.",
                    ephemeral: true,
                });
            });
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
