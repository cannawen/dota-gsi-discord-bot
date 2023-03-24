import { Fact, Topic } from "../Engine";
import colors from "@colors/colors";
import engine from "../customEngine";
import log from "../log";
import topic from "../topic";
import topicDiscord from "./topicDiscord";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;
const discordSubscriptionTopic = new Topic<Voice.PlayerSubscription>(
    "discordSubscriptionTopic"
);

engine.register(
    "discord/establish_voice_subscription",
    [topicDiscord.channel],
    (get) => {
        const channel = get(topicDiscord.channel)!;

        const connection = Voice.joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
        });
        connection.on(Voice.VoiceConnectionStatus.Ready, () => {
            log.info("discord", "VoiceConnection ready to play audio!".green);
            engine.readyToPlayAudio(true);
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status !== newState.status) {
                log.debug(
                    "discord",
                    "AudioPlayerState - transitioned from %s to %s",
                    oldState.status,
                    emColor(newState.status)
                );
            }
            if (newState.status === Voice.AudioPlayerStatus.Idle) {
                engine.readyToPlayAudio(true);
            } else {
                engine.readyToPlayAudio(false);
            }
        });

        return [
            new Fact(topic.discordReadyToPlayAudio, false),
            new Fact(discordSubscriptionTopic, connection.subscribe(player)),
        ];
    }
);

engine.register(
    "discord/play_next",
    [
        topic.discordReadyToPlayAudio,
        topic.discordAudioQueue,
        discordSubscriptionTopic,
    ],
    (get) => {
        const ready = get(topic.discordReadyToPlayAudio)!;
        const subscription = get(discordSubscriptionTopic)!;
        const audioQueue = [...get(topic.discordAudioQueue)!];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.pop()!;
            log.info("discord", "Playing %s", emColor(filePath));
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return [
                new Fact(topic.discordAudioQueue, audioQueue),
                new Fact(topic.discordReadyToPlayAudio, false),
            ];
        }
    }
);
