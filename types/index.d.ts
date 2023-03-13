// MIT License

// Copyright (c) 2020 Michael Ketzer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

declare module "dota2-gsi" {
    export enum CLIENT_EVENTS {
        MAP_CLOCKTIME = "map:clock_time",
        MAP_DAYTIME = "map:daytime",
        MAP_DIRE_WARD_CD = "map:dire_ward_purchase_cooldown",
        MAP_GAMESTATE = "map:game_state",
        MAP_GAMETIME = "map:game_time",
        MAP_NAME = "map:name",
        MAP_MATCHID = "map:matchid",
        MAP_RADIANT_WARD_CD = "map:radiant_ward_purchase_cooldown",
        MAP_NS_NIGHT = "map:nightstalker_night",
        MAP_ROSH_STATE = "map:roshan_state",
        MAP_ROSH_STATE_END = "map:roshan_state_end_seconds",
        MAP_WIN_TEAM = "map:win_team",
        MAP_CUSTOM_GAMENAME = "map:customgamename",
        HERO_ALIVE = "hero:alive",
    }

    export class Client {
        auth: {
            token: string;
        };

        on(event: CLIENT_EVENTS.HERO_ALIVE, callback: (alive: boolean) => void): void;
        on(event: CLIENT_EVENTS.MAP_WIN_TEAM, callback: (winner: "radiant" | "dire") => void): void;
        on(event: CLIENT_EVENTS, callback: (value: any) => void): void;
        on(event: string, callback: (value: any) => void): void;
    }

    interface D2GSIParams {
        port?: number;
    }

    export default class d2gsi {
        constructor(params?: D2GSIParams);
        events: {
            on(event: string, callback: (client: Client) => void): void,
        };
    }
}
