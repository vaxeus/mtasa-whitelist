const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.js");
const pool = require('./datebase.js');
const fs = require("fs");

const client = new Client({
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

module.exports = { client, pool };

fs.readdir("./events", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);

        let eventName = file.split(".")[0];

        console.log(`[+] Loadded Event: ${eventName}.js`);

        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = [];

fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
        try {
            let props = require(`./commands/${f}`);

            client.commands.push({
                name: props.name,
                description: props.description,
                options: props.options
            });

            console.log(`[+] Loaded command: ${props.name}.js`);
        } catch (err) {
            console.log(err);
        }
    });
});

client.once('ready', async () => {
    console.log(`[+] Loaded Client: Bot is ready!`);

    const guilds = client.guilds.cache;

    guilds.forEach(async (guild) => {
        if (guild.id !== config.guard_id) {
            try {
                await guild.leave();
                console.log(`[+] Leaving server: ${guild.name} (${guild.id})`);
            } catch (error) {
                console.error(`[-] Failed to leave server ${guild.id}: ${error.message}`);
            }
        }
    });
});

client.on('guildCreate', async (guild) => {
    if (guild.id !== config.guard_id) {
        try {
            await guild.leave();
            console.log(`[+] Leaving server: ${guild.name} (${guild.id})`);
        } catch (error) {
            console.error(`[-] Failed to leave server ${guild.id}: ${error.message}`);
        }
    }
});

client.login(config.token).catch(e => {
    console.log("[-] Unknown Token")
})