const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const gatewayService = require('../../database/management/services/gatewayService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('close')
		.setDescription('Close a gate'),

	async execute(interaction) {
		const userId = interaction.user.id;

        const user = await userService.getUserById(userId);

		if (!(user)) {
			return await interaction.reply({ content: 'You don\'t have any gates open', flags: MessageFlags.Ephemeral });
		}

        const gateway = await gatewayService.getGatewayFromUser(userId);

        if (!gateway) {
            return await interaction.reply({ content: `You don't have any gates open`, flags: MessageFlags.Ephemeral });
        }

        const isGateRemoved = await gatewayService.removeGatewayByUser(userId);

        if (isGateRemoved) {
            return await interaction.reply({ content: `The gate **${gateway.gatename}** is now closed`, flags: MessageFlags.Ephemeral });
        } else {
            return await interaction.reply({ content: `The gate **${gateway.gatename}** could not be closed`, flags: MessageFlags.Ephemeral });
        }
        

	},
};