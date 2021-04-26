
import * as fs from 'fs';

const targetConfigFilePath = `/home/${process.env.USER}/.creds/discord-bots-keys.json`
if (!fs.existsSync(targetConfigFilePath)) {
    throw `Failed to find file: ${targetConfigFilePath}`;
}
const config = JSON.parse(fs.readFileSync(targetConfigFilePath).toString('utf-8'));

export { config };
