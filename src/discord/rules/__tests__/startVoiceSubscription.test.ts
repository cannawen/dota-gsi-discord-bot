jest.mock("@discordjs/voice");
jest.mock("../../../customEngine");

import engine from "../../../customEngine";
import Fact from "../../../engine/Fact";
import { getResults } from "../../../__tests__/helpers";
import rule from "../startVoiceSubscription";
import Voice from "@discordjs/voice";

describe("startVoiceSubscription", () => {
    let result: Fact<unknown>;
    let spyJoinVoiceChannel: any;
    beforeEach(() => {
        spyJoinVoiceChannel = jest.spyOn(Voice, "joinVoiceChannel");

        result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
            studentId: "studentId",
        }) as Fact<unknown>;
    });

    test("voice connection established", () => {
        expect(spyJoinVoiceChannel).toHaveBeenCalledTimes(1);
        expect(spyJoinVoiceChannel.mock.lastCall![0]).toEqual({
            adapterCreator: "voiceAdapterCreator",
            channelId: "channelId",
            guildId: "guildId",
        });
    });

    describe("VoiceConnection.on", () => {
        let spyOn: any;
        let onCallback: { Ready: any; Destroyed: any };

        beforeEach(() => {
            spyOn = jest.spyOn(spyJoinVoiceChannel.mock.results[0].value, "on");
            onCallback = spyOn.mock.calls.reduce((memo: any, args: any) => {
                memo[args[0]] = args[1];
                return memo;
            }, {});
        });

        test("on ready, notify engine", () => {
            const spyReadyToPlayAudio = jest.spyOn(engine, "readyToPlayAudio");

            onCallback.Ready();

            expect(spyReadyToPlayAudio).toHaveBeenCalledTimes(1);
            expect(spyReadyToPlayAudio.mock.lastCall![0]).toBe("studentId");
            expect(spyReadyToPlayAudio.mock.lastCall![1]).toBe(true);
        });

        test("on destroy, notify engine", () => {
            const spyCleanupSession = jest.spyOn(engine, "cleanupSession");

            onCallback.Destroyed();

            expect(spyCleanupSession).toHaveBeenCalledTimes(1);
            expect(spyCleanupSession.mock.lastCall![0]).toBe("studentId");
        });
    });

    test("returns discord subscription fact", () => {
        expect(result).toContainTopic("discordSubscriptionTopic");
    });
});
