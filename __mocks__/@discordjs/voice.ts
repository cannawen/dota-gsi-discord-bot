/* eslint-disable sort-keys */
const voice = {
    createAudioPlayer: jest.fn().mockReturnValue({ on: jest.fn() }),
    createAudioResource: jest.fn().mockReturnValue("AudioResource"),
    joinVoiceChannel: jest.fn().mockReturnValue({
        destroy: jest.fn(),
        on: jest.fn(),
        subscribe: jest.fn(),
    }),
    AudioPlayerStatus: {
        AutoPaused: "autopaused",
        Buffering: "buffering",
        Idle: "idle",
        Paused: "paused",
        Playing: "playing",
    },
    VoiceConnectionStatus: {
        Connecting: "connecting",
        Destroyed: "destroyed",
        Disconnected: "disconnected",
        Ready: "ready",
        Signalling: "signalling",
    },
};

module.exports = voice;
