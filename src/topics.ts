/* eslint-disable sort-keys */
import { DeepReadonly } from "ts-essentials";
import Event from "./gsi-data-classes/Event";
import GsiData from "./gsi/GsiData";
import manager from "./engine/topicManager";
import PersistentTopic from "./engine/PersistentTopic";
import PlayerItems from "./gsi-data-classes/PlayerItems";
import rules from "./rules";
import { Status } from "./assistants/helpers/roshan";
import Topic from "./engine/Topic";
import Voice from "@discordjs/voice";

const gsi = {
    allData: new Topic<DeepReadonly<GsiData>>("allData"),

    // events
    event: new Topic<DeepReadonly<Event>>("event"),
    // hero
    alive: new Topic<boolean>("alive"),
    buybackCost: new Topic<number>("buybackCost"),
    buybackCooldown: new Topic<number>("buybackCooldown"),
    respawnSeconds: new Topic<number>("respawnSeconds"),
    // items
    items: new Topic<DeepReadonly<PlayerItems>>("items"),
    // map
    daytime: new Topic<boolean>("daytime"),
    inGame: new PersistentTopic<boolean>("inGame", {
        persistAcrossGames: true,
    }),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
    // player
    gold: new Topic<number>("gold"),
    // provider
    // Also set when we create a new coaching session
    timestamp: new PersistentTopic<number>("timestamp", {
        defaultValue: 0,
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
};

/**
 * playPublicAudio and playPrivateAudio take in either
 * 1) A hardcoded file in ./resources/audio/ directory
 * 2) A message that will be TTS-ed and saved to ./resources/audio/tts-cache/
 */
const effect = {
    // This is used as a temporary topic to be swap out by rule decorator configurable
    configurableEffect: new Topic<string>("configurableEffect"),

    playPublicAudio: new Topic<string>("playPublicAudio"),
    publicAudioQueue: new Topic<DeepReadonly<string[]>>("publicAudioQueue", []),

    playPrivateAudio: new Topic<string>("playPrivateAudio"),
    privateAudioQueue: new Topic<DeepReadonly<string[]>>(
        "privateAudioQueue",
        []
    ),

    playInterruptingAudioFile: new Topic<string>("playInterruptingAudioFile"),

    stopAudio: new Topic<boolean>("stopAudio"),
};

const discord = {
    discordUserId: new PersistentTopic<string>("discordUserId", {
        persistForever: true,
    }),
    discordGuildId: new PersistentTopic<string | null>("discordGuildId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    discordGuildChannelId: new PersistentTopic<string | null>(
        "discordGuildChannelId",
        {
            persistAcrossGames: true,
            persistAcrossRestarts: true,
        }
    ),
    // playing audio
    discordReadyToPlayAudio: new PersistentTopic<boolean>(
        "discordReadyToPlayAudio",
        {
            persistAcrossGames: true,
        }
    ),
    discordSubscriptionTopic: new PersistentTopic<Voice.PlayerSubscription>(
        "discordSubscriptionTopic",
        {
            persistAcrossGames: true,
        }
    ),
    discordAudioEnabled: new PersistentTopic<boolean>("discordAudioEnabled", {
        persistAcrossGames: true,
    }),
    lastDiscordUtterance: new Topic<string>("lastDiscordUtterance"),

    discordVoiceRecognitionPermissionGranted: new PersistentTopic<boolean>(
        "discordVoiceRecognitionPermissionGranted",
        {
            persistForever: true,
        }
    ),
};

const sharedGameState = {
    roshanStatus: new PersistentTopic<Status>("roshanStatus", {
        defaultValue: Status.NOT_IN_A_GAME,
        persistAcrossRestarts: true,
    }),
    roshanAegisExpiryTime: new PersistentTopic<number>(
        "roshanAegisExpiryTime",
        { persistAcrossRestarts: true }
    ),
    roshanMaybeAliveTime: new PersistentTopic<number>("roshanMaybeAliveTime", {
        persistAcrossRestarts: true,
    }),
    roshanAliveTime: new PersistentTopic<number>("roshanAliveTime", {
        persistAcrossRestarts: true,
    }),
    roshanPercentChanceAlive: new PersistentTopic<number>(
        "roshanPercentAlive",
        { persistAcrossRestarts: true }
    ),
};

function configTopics() {
    return Object.fromEntries(
        Object.entries(rules.assistant).map(([name, id]) => [
            name,
            manager.createConfigTopic(id),
        ])
    );
}

const allTopics = {
    studentId: new PersistentTopic<string>("studentId", {
        persistAcrossGames: true,
        persistAcrossRestarts: true,
    }),
    updateFrontend: new Topic<boolean>("updateFrontend"),
    ...configTopics(),
    ...sharedGameState,
    ...effect,
    gsiEventsFromLiveGame: new Topic<boolean>("gsiEventsFromLiveGame"),
    gsiVersion: new PersistentTopic<string>("gsiVersion", {
        persistForever: true,
    }),
    ...gsi,
    ...discord,
};

export function registerAllTopics() {
    Object.values(allTopics).forEach((topic) => manager.registerTopic(topic));
}
/**
 * These are topics that cross different modules
 * A module may still choose to create a local topic
 * But it must be created using topicManager
 * so it can be registered properly
 */
export default {
    ...allTopics,
};
