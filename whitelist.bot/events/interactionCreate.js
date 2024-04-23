const { InteractionType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const pool = require('../datebase.js');
const config = require('../config.js');
const fs = require("fs");

module.exports = async(client, interaction) => {
    if(!interaction.guild) return;
    if(interaction.user.bot) return;

    if (interaction.type === InteractionType.ApplicationCommand) {
        fs.readdir("./commands", (err, files) => {
            if (err) throw err;
            files.forEach(async (f) => {
                let props = require(`../commands/${f}`);
                if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
                    try {
                        return props.run(client, interaction);
                    } catch (e) {
                        return interaction.reply({ content: `ERROR\n\n\`\`\`${e.message}\`\`\``, ephemeral: true }).catch(e => { })
                    }
                }
            });
        });
    } else if (interaction.isButton()) {
        const { customId } = interaction;
        if (customId === 'verify') {
            const accountAge = Date.now() - interaction.user.createdTimestamp;
            const threeMonths = 90 * 24 * 60 * 60 * 1000; // milliseconds in three months

			if (accountAge <= threeMonths) {
                await interaction.reply({ content: "You need to be registered on discord for at least 3 months to verify.", ephemeral: true });
            }
			
            const modal = new ModalBuilder()
			.setCustomId('verifyModal')
			.setTitle('Whitelist');

            const favoriteColorInput = new TextInputBuilder()
			.setCustomId('keyInput')
			.setLabel("Enter the required code:")
            .setMaxLength(7)
            .setPlaceholder('Example: 2H1A2TF')
			.setStyle(TextInputStyle.Short)
            .setRequired(true);
            
            const secondActionRow = new ActionRowBuilder()
            .addComponents(favoriteColorInput);

            modal.addComponents(secondActionRow);
            
            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        const { customId } = interaction;

        if (customId === 'verifyModal') {
            const code = interaction.fields.getTextInputValue('keyInput');
            try {
                const [rows, fields] = await pool.query("SELECT * FROM `whitelist` WHERE `key`=? LIMIT 1", [code]);

                if (rows.length === 1) {
                    const keyData = rows[0];

                    if (keyData.enabled === 0) {
                        if (!keyData.discord) {
                            if (keyData.banned === 0) {
                                await pool.query('UPDATE `whitelist` SET `discord` = ?, `enabled` = 1 WHERE `key` = ?', [interaction.user.id, code]);

                                const role = interaction.guild.roles.cache.get(config.linked_role);
                                await interaction.member.roles.add(role);

                                await interaction.reply({ content: `**We have successfully added your serial (${keyData.serial}) to the whitelist**`, ephemeral: true });
                            } else {
                                await interaction.reply({ content: '**You cannot add this serial to a whitelist, it is banned**', ephemeral: true });
                            }
                        } else {
                            await interaction.reply({ content: '**This Key has been used by another Discord Account.**', ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: '**This Key has been activated From another serial.**', ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: '**Invalid key, Enter the key correctly.**', ephemeral: true });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '**An error occurred during verification.**', ephemeral: true });
            }
        }
    }
}