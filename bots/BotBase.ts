
import * as Discord from "discord.js";

export class BotBase {

    protected _client: Discord.Client;

    constructor() {
        console.log("Bot base constructor...");
        this._client = new Discord.Client();
    }

    init() {
        throw "'init' function not declared to the current class.";
    }
};
