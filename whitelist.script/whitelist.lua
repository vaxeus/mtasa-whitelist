local datebase = {
    db = "", -- you database name
    name = "", -- your phpmyadmin username
    pass = "", -- your phpmyadmin password
    host = "", -- your host ip
    port = 3306
}


connection = dbConnect( "mysql", "dbname=" .. datebase.db .. ";host=" .. datebase.host .. ";charset=utf8", datebase.name, datebase.pass )
if (not connection) then
    outputDebugString("Error: Failed connection to the MySQL database server")
else
    outputDebugString("Success: Connected to the MySQL database server")
end

function generateRandomKey()
    local keyChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    local key = ""
    for i = 1, 7 do
        local randomIndex = math.random(#keyChars)
        key = key .. keyChars:sub(randomIndex, randomIndex)
    end
    return key
end

function playerConnect(playerNick, playerIP, playerUsername, playerSerial)
    local query = dbQuery(connection, "SELECT * FROM `whitelist` WHERE serial=?", playerSerial)
    if not query then
        return
    end

    local result, num_affected_rows, last_insert_id = dbPoll(query, -1)
    if not result then
        return
    end

    local queryBlacklist = dbQuery(connection, "SELECT * FROM blacklist WHERE serial=?", playerSerial)
    local resultBlacklist = dbPoll(queryBlacklist, -1)

    if resultBlacklist and #resultBlacklist > 0 then
        cancelEvent(true, "Your serial is blacklisted. You are not allowed to connect to this server.")
        return
    end

    if #result > 0 then
        local playerData = result[1]

        if playerData.enabled == 0 then
            cancelEvent(true, "Join our Discord Server to verify (discord.gg/mtascripts) and request verify from the bot via the code: " .. playerData.key)
            return
        end

        if playerData.enabled == 1 and not playerData.discord then
            cancelEvent(true, "Your Discord account is not linked, Get help from Discord Server: discord.gg/mtascripts")
            return
        end

    else
        local key = generateRandomKey()
        local success = dbExec(connection, "INSERT INTO `whitelist` (`key`, `serial`) VALUES (?, ?)", key, playerSerial)
        if success then
            cancelEvent(true, "Join our Discord Server to verify (discord.gg/mtascripts) and request verify from the bot via the code: " .. key)
        end
    end

    dbFree(query)
    dbFree(queryBlacklist)
end
addEventHandler("onPlayerConnect", getRootElement(), playerConnect)

