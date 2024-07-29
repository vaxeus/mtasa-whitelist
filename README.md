# MTA:SA whitelist

It allows players to link your Discord account in order to join the server

# Requirements

1. Install node.js [Download](https://nodejs.org/en)
2. Buy a host or create a localhost for bot, database [ Localhost database: [AppServ](https://www.appserv.org/en/download/) ]
3. Create a bot on your discord account from here: [click here](https://discord.com/developers/applications) | It's a video of how to build the bot [click here](https://www.youtube.com/watch?v=GvK-ZigEV4Q)

# Installation

1. Add the bot on your server
2. Next setup, go to the `config.js` file and add your configuration bot

```js
module.exports = {
      'token': "", // your bot token
      'botStatus': "Shopify Whitelist", // bot status
      'owners': [""], // Owners ID
      'guard_id': '', // server id
      'linked_role': '' // The role id of whitelisted members
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

4. Then install the `whitelist.script` on your server `Your server patch/mods/deathmatch/resources`
5. Add the configuration in the `whitelist.script/whitelist.lua` file.

```lua
local database = {
      db = "", -- the name of your database
      name = "", -- your phpmyadmin username
      pass = "", -- your phpmyadmin password
      host = "", -- the IP address of the host
}
```

# Starting Application

> Install and run the bot:

1. Open Cmd (click win, r at keyboard and type cmd)
2. select your `whitelist.bot` folder `cd <folder path>`
3. Type `npm install` to install the packages
4. after finish install packages type node.

> Install script at server:

1. after add the script on the server open f8 and type `refresh`
2. to start the script type `start whitelist.script`

# Note

If you need any help, head over to our Discord server [Link](https://discord.gg/8TkJ2s8NtD)
