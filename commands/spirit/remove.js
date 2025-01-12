const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Remove one of your spirits')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the spirit you want to remove')
				.setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const nameSpirit = interaction.options.getString('name');

        const isSpiritRemoved = await spiritService.removeSpiritByNameAndUser(nameSpirit, userId);

        if (isSpiritRemoved) {
            await interaction.reply({ content: `Spirit **${nameSpirit}** is removed`, flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: `Spirit **${nameSpirit}** does not exists here`, flags: MessageFlags.Ephemeral });
        }

    },
};

