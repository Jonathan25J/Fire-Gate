const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const gatewayService = require('../../database/management/services/gatewayService');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('current')
        .setDescription('Show the current gate you have opened'),

    async execute(interaction) {
        const userId = interaction.user.id;

        const gateway = await gatewayService.getGatewayFromUser(userId);

        if (!gateway) {
            return await interaction.reply({ content: 'You don\'t have a gate opened', flags: MessageFlags.Ephemeral });
        }

        const spirit = await spiritService.getSpiritByName(gateway.spirit_name);

        if (!spirit) {
            return await interaction.reply({ content: 'Something went wrong while retrieving the spirit who opened the gate', flags: MessageFlags.Ephemeral });
        }

        const embed = new EmbedBuilder()
            .setTitle('Current Opened Gate')
            .addFields(
                { name: 'Name', value: gateway.gate_name },
                { name: 'Opened by spirit', value: spirit.name },
            )
            .setThumbnail(spirit.avatar)
            .setColor(spirit.color);

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};

