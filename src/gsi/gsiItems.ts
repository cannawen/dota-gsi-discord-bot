import { engine, Fact } from "../Engine";
import PlayerItems from "../PlayerItems";
import topics from "../topics";

engine.register("gsi/items", [topics.gsiData], (db) => {
    const gsiItems = db.get(topics.gsiData).items;
    if (gsiItems) {
        return [new Fact(topics.items, PlayerItems.create(gsiItems))];
    } else {
        return [new Fact(topics.items, undefined)];
    }
});
