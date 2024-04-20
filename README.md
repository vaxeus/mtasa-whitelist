# MTA:SA whitelist

It allows players to link your Discord account in order to join the server

# Installation

1. You need to setup your bot from this link [click here](https://discord.com/developers/applications) | It's a video of how to build the bot [click here](https://www.youtube.com/watch?v=GvK-ZigEV4Q)
2. Add the bot on your server
3. Next setup, go to the `config.js` file and add your configuration bot

```js
module.exports = {
      Token: "", // your bot token
      botStatus: "Shopify Whitelist", // bot status
      Owners: [""], // Owners ID
      linked_role: '', // The role of whitelisted members
}
```

4. After that go to the `database.js` file, add configure your database

```js
const pool = mysql.createPool({
      Host: "", // IP address of the host e.g. 172.0.0.1
      User: "", // Your MySQL username
      Password: "", // Your MySQL password
      database: "", // the name of your database
      WaitForConnections: true,
      Connection limit: 10,
      Queue limit: 0,
});
```

4. Then install the script on your server `Your server patch/mods/deathmatch/resources`
5. Add the configuration in the `whitelist/whitelist.lua` file.

```lua
local database = {
      db = "", -- the name of your database
      name = "", -- your phpmyadmin username
      pass = "", -- your phpmyadmin password
      host = "", -- the IP address of the host
      Port=3306
}
```

# How to start the bot/script

> To install the bot:

1. Download Node.js from this link [click here](https://nodejs.org/en)
2. Open cmd in the Whitelist.bot folder
3. Type `npm install` to install the packages

> To install the script:
1. Go to your server in mta and open f8, type `refresh` and `start whitelist`

# Note

If you need any help, head over to our Discord server
- https://discord.gg/mtascripts
