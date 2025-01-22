const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('The list of all your spirits'),

    async execute(interaction) {
        const userId = interaction.user.id;

        const spirits = await spiritService.getSpiritsFromUser(userId);

        if (!spirits) {
            return await interaction.reply({ content: 'You don\'t have any spirits', flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({ content: 'You have the following spirits:', flags: MessageFlags.Ephemeral });

        for (const spirit of spirits) {
            const embed = new EmbedBuilder()
                .setTitle(spirit.name)
                .setThumbnail(spirit.avatar)
                .setColor(spirit.color);
            await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

    },
};

