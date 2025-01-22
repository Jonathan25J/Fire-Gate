const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const gateService = require('../../database/management/services/gateService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('The list of all your gates'),

    async execute(interaction) {
        const userId = interaction.user.id;

        const gates = await gateService.getGatesFromUser(userId);

        if (!gates) {
            return await interaction.reply({ content: 'You don\'t have any gates', flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({ content: 'You have the following gates:', flags: MessageFlags.Ephemeral });

        for (const gate of gates) {
            const embed = new EmbedBuilder()
                .setTitle(gate.name)
            await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

    },
};

