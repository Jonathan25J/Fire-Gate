const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const gateService = require('../../database/management/services/gateService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('remove')
		.setDescription('Remove a gate')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the gate')
				.setRequired(true)),

	async execute(interaction) {
		const userId = interaction.user.id;
		const name = interaction.options.getString('name');

        const user = await userService.getUserById(userId);

		if (!(user)) {
			return await interaction.reply({ content: 'You don\'t have any gates', flags: MessageFlags.Ephemeral });
		}

        const isGateRemoved = await gateService.removeGateByNameAndUser(name, userId);

        if (isGateRemoved) {
            await interaction.reply({ content: `Gate **${name}** is gone`, flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: `The gate **${name}** does not exist here`, flags: MessageFlags.Ephemeral });
        }
	},
};