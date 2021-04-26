import { config } from "../config";
import { BotBase } from "../Bot";

import { Message } from "discord.js";

const ACTION_PREFIX = "rando ";

export class RandoBot extends BotBase {

    constructor() {
        super();
        console.log("Rando Bot online!");
    }

    init() {
        // Bind actions
        this._client.on("message", this.on_incoming_message);

        // Grab token
        const BOT_TOKEN: string = config.RANDO_BOT_KEY;
        if (!BOT_TOKEN) {
            throw "Could not find a valid config.RANDO_BOT_KEY value!";
        }

        // Login
        this._client.login(BOT_TOKEN);
    }

    on_incoming_message(message: Message) {
        if (message.author.bot) { console.log("1"); return; }
        if (!message.content.startsWith(ACTION_PREFIX)) { console.log("2"); return; }

        console.log(message); 
    }
};
