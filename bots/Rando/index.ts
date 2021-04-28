import { config } from "../config";
import { BotBase } from "../BotBase";
import { asNumberPairOrNull } from "../util";
import { rollDice } from "./random_util";

import { Message } from "discord.js";

const ACTION_PREFIX_REGEX = /^rando( |$)/; 

const RESPONSE_HELP = (
    "Hi I'm Rando! I facilitate the heartless tyranny of random chance!\n" +
    "Type: rando " +
    "   help - show this message\n" +
    "   <number> - Returns a random number between 1 and <number>\n" +
    "   <number1>,<number2> - Returns a random number between <number1> and <number2>\n" +
    "   lucky <number> - You have a 1 in <number> chance of being a winner\n" +
    "   spin - [TODO] Spin a standard roulette wheel"
);

export class RandoBot extends BotBase {

    constructor() {
        super();
        console.log("Rando Bot online!");
    }

    async init() {
        // Bind actions
        this._client.on("message", this.receive_incoming_message);

        // Grab token
        const BOT_TOKEN: string = config.RANDO_BOT_KEY;
        if (!BOT_TOKEN) {
            throw "Could not find a valid config for RANDO_BOT_KEY value!";
        }

        // Login
        this._client.login(BOT_TOKEN); // ORPHAN PROMISE
    }

    receive_incoming_message(message: Message) {
        if (message.author.bot) { return; }
        const message_content = message.content;
        if (!message_content.match(ACTION_PREFIX_REGEX)) { return; }

        const parts: string[] = message_content.split(/\s+/);
        if (parts.length < 1) {
            console.warn("Message with an empty body?");
            return;
        }
        parts.shift() // Ignore initial action prefix

        console.log(`Reading a message from ${message.author.username}...`);

        if (parts.length < 1) {
            console.log("Message without any arguments, responding with help.");
            message.reply(RESPONSE_HELP);
            return;
        }
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

            on_said_numbers(message, min_random, max_random);
            return;
        }

        console.log("Parsing inner parts of the request...");

        const first_part_lower: string = first_part.toLowerCase();
        switch (first_part_lower) {

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
                on_said_spin(message, parts);
            }
                break;

            case "lucky": {
                console.log("Lucky roll");
                on_said_lucky(message, parts);
            }
                break;

            default: {
                console.log("Invalid input");
                message.reply(`What do you mean by '${first_part_lower}'? (first)`);
            }
                break;
        }

        //console.log(message);
    }
};

function on_said_hello(message: Message) {
    message.reply(`Hello there ${message.author.username} <stares menacingly>`);
}

function on_said_help(message: Message) {
    message.reply(RESPONSE_HELP);
}

function on_said_spin(message: Message, parts: string[]) {
    message.reply(`I'm sorry '${message.author.username}, my creator is lazy and hasn't implemented that yet. Args: ${parts.toString()}`);
}

function on_said_numbers(message: Message, min_random: number, max_random: number) {

    // Determine odds
    const total_odds = (max_random - min_random) + 1;
    if (total_odds <= 1) {
        message.reply("Error: Number should be positive and the first number should be smaller than the second.");
        return;
    }

    // Determine answer
    const answer = rollDice(min_random, max_random);

    // Respond
    message.reply(`A roll between ${min_random} and ${max_random} gives...\n${answer}`);
}

function on_said_lucky(message: Message, parts: string[]) {
    // Determine if any user supplied errors
    if (parts.length < 1) {
        message.reply("Error: Include a number for the odds.");
    }
    const lucky_number = Math.round(parseFloat(parts[0])) || null;
    if (lucky_number === null) {
        message.reply("Error: Lucky number provided is not a number.");
        return;
    }
    if (lucky_number <= 1) {
        message.reply("Error: Lucky number should be larger than 1.");
        return;
    }

    // Calculate roll and return
    let response = `Roll with 1 in ${lucky_number} (${Math.round(100 * (1.0 / lucky_number))}%) chance...`;
    const roll_result = rollDice(1, lucky_number);
    if (roll_result == 1) {
        message.reply(response + "\nWinner!");
    } else {
        message.reply(response + "\nSorry, not your lucky day.");
    }
}
