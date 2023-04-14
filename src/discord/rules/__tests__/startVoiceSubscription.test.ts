jest.mock("@discordjs/voice");
jest.mock("../../../customEngine");
jest.mock("../../../log");

import engine from "../../../customEngine";
import Fact from "../../../engine/Fact";
import { getResults } from "../../../__tests__/helpers";
import rule from "../startVoiceSubscription";
import topics from "../../../topics";
import Voice from "@discordjs/voice";

describe("startVoiceSubscription", () => {
    let result: Fact<unknown>;

    let voiceConnection: Voice.VoiceConnection;
    let audioPlayer: Voice.AudioPlayer;

    beforeEach(() => {
        result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
            studentId: "studentId",
        }) as Fact<unknown>;

        voiceConnection = (Voice.joinVoiceChannel as jest.Mock).mock.results[0]
            .value;
        audioPlayer = (Voice.createAudioPlayer as jest.Mock).mock.results[0]
            .value;
    });

    describe("createVoiceConnection", () => {
        test("voice connection established", () => {
            expect(Voice.joinVoiceChannel).toHaveBeenCalledWith({
                adapterCreator: "voiceAdapterCreator",
                channelId: "channelId",
                guildId: "guildId",
            });
            expect(voiceConnection).not.toBeUndefined();
        });

        describe("VoiceConnection.on", () => {
            let readyFn: any;
            let destroyFn: any;

            beforeEach(() => {
                (voiceConnection.on as jest.Mock).mock.calls.forEach(
                    ([state, stateChangeFn]) => {
                        if (state === "Ready") {
                            readyFn = stateChangeFn;
                        }
                        if (state === "Destroyed") {
                            destroyFn = stateChangeFn;
                        }
                    }
                );
            });

            test("on(Ready), notify engine", () => {
                readyFn();
                expect(engine.setFact).toHaveBeenCalledWith(
                    "studentId",
                    new Fact(topics.discordReadyToPlayAudio, true)
                );
            });

            test("on(Destroyed), notify engine", () => {
                destroyFn();
                expect(engine.deleteSession).toHaveBeenCalledWith("studentId");
            });
        });
    });

    describe("createAudioPlayer", () => {
        test("create player", () => {
            expect(Voice.createAudioPlayer).toHaveBeenCalledTimes(1);
            expect(audioPlayer).not.toBeUndefined();
        });

        describe("AudioPlayer.on(stateChange)", () => {
            let stateChangeFn: any;

            beforeEach(() => {
                stateChangeFn = (audioPlayer.on as jest.Mock).mock.lastCall[1];
            });
            test("registers for stateChange events", () => {
                expect(audioPlayer.on).toHaveBeenCalledWith(
                    "stateChange",
                    stateChangeFn
                );
            });
            test("notify engine ready to play audio when state changes to Idle", () => {
                stateChangeFn({ status: "Playing" }, { status: "Idle" });
                expect(engine.setFact).toHaveBeenCalledWith(
                    "studentId",
                    new Fact(topics.discordReadyToPlayAudio, true)
                );
            });
            test("notify engine not ready to play audio when state changes to Buffering", () => {
                stateChangeFn({ status: "Idle" }, { status: "Buffering" });
                expect(engine.setFact).toHaveBeenCalledWith(
                    "studentId",
                    new Fact(topics.discordReadyToPlayAudio, false)
                );
            });
        });
    });

    describe("Voice.PlayerSubscription", () => {
        test("creates subscription", () => {
            expect(voiceConnection.subscribe).toHaveBeenCalledWith(audioPlayer);
        });

        test("returns discord subscription fact", () => {
            expect(result).toContainFact(
                "discordSubscriptionTopic",
                (voiceConnection.subscribe as jest.Mock).mock.results[0].value
            );
        });
    });
});
