
import * as fs from 'fs';

interface BotConfig {
    "RANDO_BOT_KEY": string
};

// Load sensitive Discord keys from ~/.creds
const targetConfigFilePath = `/home/${process.env.USER}/.creds/discord-bots-keys.json`
if (!fs.existsSync(targetConfigFilePath)) {
    throw (
        `Failed to find file: ${targetConfigFilePath}\n` + 
        "This is normal if you are attempting to run immediately after cloning.\n" +
        `Create a file: ${targetConfigFilePath}\n`
    );
}
const config: BotConfig = JSON.parse(fs.readFileSync(targetConfigFilePath).toString('utf-8'));

export { config, BotConfig };
