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
            throw new Error("Actual value must be a string");
        }

        const isAudioFile = actual.type == Type.AUDIO_FILE;
        const isSameData = actual.data == expected;
        const pass = isAudioFile && isSameData;

        return {
            pass,
            message: pass
                ? () => `expected to have different data ${actual.data} in audio file`
                : () => `expected to have data ${actual.data} in audio file`,
        };
    },
});
