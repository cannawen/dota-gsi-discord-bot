import SideEffectInfo, {
    Type,
} from "./src/SideEffectInfo";

expect.extend({
    toBeWithinRange(actual, min, max) {
        if (typeof actual !== "number") {
            throw new Error("Actual value must be a number");
        }

        const pass = actual >= min && actual <= max;

        return {
            pass,
            message: pass
                ? () => `expected ${actual} not to be within range (${min}..${max})`
                : () => `expected ${actual} to be within range (${min}..${max})`,
        };
    },

    setContaining(actual, expected) {
        if (!(actual instanceof Set)) {
            throw new Error("Actual value must be a Set");
        }

        const pass = expected.every((item) => actual.has(item));

        return {
            pass,
            message: pass
                ? () => `expected Set not to contain ${expected.join(", ")}`
                : () => `expected Set to contain ${expected.join(", ")}`,
        };
    },

    toBeAudio(actual, expected) {
        if (!(actual instanceof SideEffectInfo)) {
            throw new Error("Actual value must be a SideEffectInfo");
        }

        const pass = actual.type == Type.AUDIO_FILE && actual.data == expected;

        return {
            pass,
            message: pass
                ? () => `expected to have different file name than ${actual.data}`
                : () => `actual file name ${actual.data?.red} in audio file instead of ${expected.green}`,
        };
    },

    toBeTTS(actual, expected) {
        if (!(actual instanceof SideEffectInfo)) {
            throw new Error("Actual value must be a SideEffectInfo");
        }

        const pass = actual.type == Type.TTS && actual.data == expected;

        return {
            pass,
            message: pass
                ? () => `expected to have different message than ${actual.data?.red}`
                : () => `actual TTS message was ${actual.data?.red} instead of ${expected.green}`,
        };
    },
});
