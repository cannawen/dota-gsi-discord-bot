import betweenSeconds from "./betweenSeconds";
import Rule from "../Rule";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
export default function atMinute(time: number, rule: Rule) {
    return betweenSeconds(time * 60, time * 60, rule);
}
