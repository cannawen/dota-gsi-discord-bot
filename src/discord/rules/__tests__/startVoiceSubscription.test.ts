jest.mock("@discordjs/voice");
jest.mock("../../../customEngine");
jest.mock("../../../log");

import engine from "../../../customEngine";
import Fact from "../../../engine/Fact";
import { getResults } from "../../../__tests__/helpers";
import rule from "../startVoiceSubscription";
import Voice from "@discordjs/voice";

describe("startVoiceSubscription", () => {
    let result: Fact<unknown>;

    let spyJoinVoiceChannel: any;
    let spyCreateAudioPlayer: any;

    let voiceConnection: Voice.VoiceConnection;
    let audioPlayer: Voice.AudioPlayer;

    beforeEach(() => {
        spyJoinVoiceChannel = jest.spyOn(Voice, "joinVoiceChannel");
        spyCreateAudioPlayer = jest.spyOn(Voice, "createAudioPlayer");

        result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
            studentId: "studentId",
        }) as Fact<unknown>;

        voiceConnection = spyJoinVoiceChannel.mock.results[0].value;
        audioPlayer = spyCreateAudioPlayer.mock.results[0].value;
    });

    describe("createVoiceConnection", () => {
        test("voice connection established", () => {
            expect(spyJoinVoiceChannel).toHaveBeenCalledTimes(1);
            expect(spyJoinVoiceChannel.mock.lastCall![0]).toEqual({
                adapterCreator: "voiceAdapterCreator",
                channelId: "channelId",
                guildId: "guildId",
            });
            expect(voiceConnection).not.toBeUndefined();
        });

        describe("VoiceConnection.on", () => {
            let spyOn: any;
            let onCallback: { Ready: any; Destroyed: any };

            beforeEach(() => {
                spyOn = jest.spyOn(voiceConnection, "on");
                onCallback = spyOn.mock.calls.reduce((memo: any, args: any) => {
                    memo[args[0]] = args[1];
                    return memo;
                }, {});
            });

            test("on(Ready), notify engine", () => {
                const spy = jest.spyOn(engine, "setData");

                onCallback.Ready();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy.mock.lastCall![0]).toBe("studentId");
                expect(spy.mock.lastCall![1]).toContainFact(
                    "discordReadyToPlayAudio",
                    true
                );
            });

            test("on(Destroyed), notify engine", () => {
                const spy = jest.spyOn(engine, "closeSession");

                onCallback.Destroyed();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy.mock.lastCall![0]).toBe("studentId");
            });
        });
    });

    describe("createAudioPlayer", () => {
        test("create player", () => {
            expect(spyCreateAudioPlayer).toHaveBeenCalledTimes(1);
            expect(audioPlayer).not.toBeUndefined();
        });

        describe("AudioPlayer.on(stateChange)", () => {
            let spyOn: any;
            let stateChangeFn: any;

            beforeEach(() => {
                spyOn = jest.spyOn(audioPlayer, "on");
                stateChangeFn = spyOn.mock.lastCall![1];
            });
            test("registers for stateChange events", () => {
                expect(spyOn.mock.lastCall![0]).toBe("stateChange");
            });
            test("notify engine ready to play audio when state changes to Idle", () => {
                const spy = jest.spyOn(engine, "setData");
                stateChangeFn({ status: "Playing" }, { status: "Idle" });
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy.mock.lastCall![0]).toBe("studentId");
                expect(spy.mock.lastCall![1]).toContainFact(
                    "discordReadyToPlayAudio",
                    true
                );
            });
            test("notify engine not ready to play audio when state changes to Buffering", () => {
                const spy = jest.spyOn(engine, "setData");
                stateChangeFn({ status: "Idle" }, { status: "Buffering" });
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy.mock.lastCall![0]).toBe("studentId");
                expect(spy.mock.lastCall![1]).toContainFact(
                    "discordReadyToPlayAudio",
                    false
                );
            });
        });
    });

    describe("Voice.PlayerSubscription", () => {
        let spySubscribe: any;
        beforeEach(() => {
            spySubscribe = jest.spyOn(voiceConnection, "subscribe");
        });
        test("creates subscription", () => {
            expect(spySubscribe).toHaveBeenCalledTimes(1);
            expect(spySubscribe.mock.lastCall![0]).toBe(audioPlayer);
        });

        test("returns discord subscription fact", () => {
            expect(result).toContainFact(
                "discordSubscriptionTopic",
                spySubscribe.mock.results[0].value
            );
        });
    });
});
