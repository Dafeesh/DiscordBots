import { config } from "../config";
import { BotBase } from "../BotBase";
import { asNumberPairOrNull } from "./util";

import { Message } from "discord.js";
import { fileURLToPath } from "url";

const ACTION_PREFIX = "rando ";

const RESPONSE_HELP = (
    "Hi I'm Rando! I facilitate the heartless tyranny of random chance!\n" +
    "Type: rando " +
    "   help - show this message\n" +
    "   <number> - Returns a random number between 1 and <number>\n" +
    "   <number1>,<number2> - Returns a random number between <number1> and <number2>\n" +
    "   spin - Spin a standard roulette wheel"
);

export class RandoBot extends BotBase {

    constructor() {
        super();
        console.log("Rando Bot online!");
    }

    async init() {
        // Bind actions
        this._client.on("message", this.on_incoming_message);

        // Grab token
        const BOT_TOKEN: string = config.RANDO_BOT_KEY;
        if (!BOT_TOKEN) {
            throw "Could not find a valid config for RANDO_BOT_KEY value!";
        }

        // Login
        this._client.login(BOT_TOKEN); // ORPHAN PROMISE
    }

    on_incoming_message(message: Message) {
        if (message.author.bot) { return; }
        if (!message.content.startsWith(ACTION_PREFIX)) { return; }

        const parts: string[] = message.content.split(/\s+/);
        if (parts.length < 1) {
            console.warn("Message with an empty body?");
            return;
        }
        parts.shift() // Ignore initial action prefix

        console.log(`Reading a message from ${message.author.username}...`);

        const first_part: string = parts.shift();

        // Handle numbers
        const first_part_as_int_pair = asNumberPairOrNull(first_part);
        if (first_part_as_int_pair != null) {
            console.log("Requesting random integer...");

            // User requesting random number, if two numbers then 
            let min_random = first_part_as_int_pair[0];
            let max_random = first_part_as_int_pair[1];
            if (max_random === null) {
                max_random = min_random;
                min_random = 1;
            }

            // Point out problems
            if (min_random > max_random) {
                message.reply(`First numberm must be smaller than the second number.`); // ORPHAN PROMISE
                return;
            }
            const total_odds = (max_random - min_random) + 1;
            if (total_odds <= 0) {
                message.reply(`First number should be the smaller number.`); // ORPHAN PROMISE
                return;
            }

            // Determine answer
            const answer = min_random + Math.floor(total_odds * Math.random());

            // Respond
            message.reply(`A roll between ${min_random} and ${max_random} gives...\n${answer}`); // ORPHAN PROMISE
            return;
        }

        console.log("Parsing inner parts of the request...");

        const first_part_lower: string = first_part.toLowerCase();
        switch(first_part_lower) {

            case "hello": {
                console.log("Saying hello");
                on_said_hello(message);
            }
            break;

            case "help":
            case "--help": {
                console.log("Needs help");
                on_said_help(message);
            }
            break;

            case "spin": {
                console.log("Spinning the wheel");
                on_said_spin(message);
            }
            break;

            default: {
                console.log("Invalid input");
                message.reply(`What do you mean by '${first_part_lower}'? (first)`); // ORPHAN PROMISE
            }
            break;
        }

        //console.log(message);
    }


};

function on_said_hello(message: Message) {
    message.reply(`Hello there ${message.author.username} <stares menacingly>`); // ORPHAN PROMISE
}

function on_said_help(message: Message) {
    message.reply(RESPONSE_HELP); // ORPHAN PROMISE
}

function on_said_spin(message: Message) {
    message.reply(`I'm sorry '${message.author.username}, my creator is lazy and hasn't implemented that yet.`); // ORPHAN PROMISE
}
