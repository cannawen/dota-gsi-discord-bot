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
    // building healths
    t1TopHealth: new Topic<number>("t1TopHealth"),
    t2TopHealth: new Topic<number>("t2TopHealth"),
    t3TopHealth: new Topic<number>("t3TopHealth"),
    t4TopHealth: new Topic<number>("t4TopHealth"),
    t1MidHealth: new Topic<number>("t1MidHealth"),
    t2MidHealth: new Topic<number>("t2MidHealth"),
    t3MidHealth: new Topic<number>("t3MidHealth"),
    t1BotHealth: new Topic<number>("t1BotHealth"),
    t2BotHealth: new Topic<number>("t2BotHealth"),
    t3BotHealth: new Topic<number>("t3BotHealth"),
    t4BotHealth: new Topic<number>("t4BotHealth"),
    ancientHealth: new Topic<number>("ancientHealth"),

    // events
    event: new Topic<DeepReadonly<Event>>("event"),
    // hero
    alive: new Topic<boolean>("alive"),
    buybackCost: new Topic<number>("buybackCost"),
    buybackCooldown: new Topic<number>("buybackCooldown"),
    hero: new Topic<string>("hero"),
    level: new Topic<number>("level"),
    mana: new Topic<number>("mana"),
    maxMana: new Topic<number>("maxMana"),
    respawnSeconds: new Topic<number>("respawnSeconds"),
    // items
    items: new Topic<DeepReadonly<PlayerItems>>("items"),
    // map
    customGameName: new Topic<string>("customGameName"),
    daytime: new Topic<boolean>("daytime"),
    inGame: new PersistentTopic<boolean>("inGame", {
        persistAcrossGames: true,
    }),
    time: new Topic<number>("time"),
    paused: new Topic<boolean>("paused"),
    // map + minimap
    allFriendlyHeroes: new Topic<DeepReadonly<string[]>>("allFriendlyHeroes"),
    allEnemyHeroes: new Topic<DeepReadonly<string[]>>("allEnemyHeroes"),
    // player
    gold: new Topic<number>("gold"),
    team: new Topic<string>("team", "radiant"), // if we are an observer, default to pretending to be on radiant side
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
    //basic information
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
    // voice recognition
    discordVoiceRecognitionPermissionGranted: new PersistentTopic<boolean>(
        "discordVoiceRecognitionPermissionGranted",
        {
            defaultValue: false,
            persistForever: true,
        }
    ),
    // autoconnect
    discordAutoconnectEnabled: new PersistentTopic<boolean>(
        "discordAutoconnectEnabled",
        {
            defaultValue: true,
            persistForever: true,
        }
    ),
    discordAutoconnectGuild: new PersistentTopic<string>(
        "discordAutoconnectGuild",
        {
            persistForever: true,
        }
    ),
};

const sharedGameState = {
    allRoshanDeathTimes: new PersistentTopic<number[]>(
        "allRoshanDeathTimesTopic",
        {
            defaultValue: [],
            persistAcrossRestarts: true,
        }
    ),
    roshanStatus: new PersistentTopic<Status>("roshanStatus", {
        defaultValue: Status.NOT_IN_A_GAME,
        persistAcrossRestarts: true,
    }),
    roshanAegisExpiryTime: new PersistentTopic<number>(
        "roshanAegisExpiryTime",
        { persistAcrossRestarts: true }
    ),
    roshanMinimumSpawnTime: new PersistentTopic<number>(
        "roshanMinimumSpawnTime",
        {
            persistAcrossRestarts: true,
        }
    ),
    roshanMaximumSpawnTime: new PersistentTopic<number>(
        "roshanMaximumSpawnTime",
        {
            persistAcrossRestarts: true,
        }
    ),
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
