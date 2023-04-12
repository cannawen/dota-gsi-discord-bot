const voice = {
    createAudioPlayer: jest.fn().mockReturnValue({ on: jest.fn() }),
    createAudioResource: jest.fn().mockReturnValue("AudioResource"),
    joinVoiceChannel: jest.fn().mockReturnValue({
        destroy: jest.fn(),
        on: jest.fn(),
        subscribe: jest.fn(),
    }),
    AudioPlayerStatus: {
        Idle: "Idle",
    },
    VoiceConnectionStatus: {
        Destroyed: "Destroyed",
        Ready: "Ready",
    },
};

module.exports = voice;
