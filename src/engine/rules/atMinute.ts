import betweenMinutes from "./betweenMinutes";
import Rule from "../Rule";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
export default function atMinute(time: number, rule: Rule) {
    return betweenMinutes(time, time, rule);
}
