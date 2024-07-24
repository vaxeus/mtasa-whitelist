const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../config.js');

const setupChannels = new Set();

module.exports = {
    name: "setup",
    description: "To setup the whitelist",
    options: [
        {
            name: 'channel',
            description: 'The channel to send the whitelist embed',
            type: 7,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const mentionedChannel = interaction.options.getChannel('channel');

        if (!config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        if (setupChannels.has(mentionedChannel.id)) {
            return interaction.reply({ content: 'Whitelist has already been sent to this channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setDescription(`> **Click the button below to link your Discord account to your serial and grant access to the server.**`)
            .setColor('#CD412B');

        const verify = new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
			.addComponents(verify);

        await mentionedChannel.send({ embeds: [embed], components: [row] });

        await interaction.reply({ content: `Whitelist Embed sent to ${mentionedChannel}.`, ephemeral: true });
        
        setupChannels.add(mentionedChannel.id);
    },
};
