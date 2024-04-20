const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRow } = require('discord.js');
const { pool } = require('../index.js');
const config = require('../config.js');

module.exports = {
    name: "ban",
    description: "to add a serial to blacklist",
    options: [
        {
            name: 'serial',
            description: 'The MTA:SA Serial',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        try {
            const serial = interaction.options.getString('serial');

            if (!config.owners.includes(interaction.user.id)) {
                return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
            }

            if (serial.length !== 32) {
                return interaction.reply({ content: 'Please enter a valid serial with exactly 32 characters.', ephemeral: true });
            }

            await pool.query('INSERT INTO blacklist (serial) VALUES (?)', [serial]);

            await interaction.reply({ content: `The serial **${serial}** has been added to the blacklist.`, ephemeral: true });
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ content: 'An error occurred. Please check your input and try again.', ephemeral: true });
        }
    },
};