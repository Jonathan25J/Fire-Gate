const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const gateService = require('../../database/management/services/gateService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('create')
		.setDescription('Create a new gate')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the gate')
				.setRequired(true)),

	async execute(interaction) {
		const userId = interaction.user.id;
		const name = interaction.options.getString('name');

        const user = await userService.getUserById(userId);

		if (!(user)) {
			await userService.createUser(userId);
		}

        const isGateCreated = await gateService.createGate(name, userId);

        if (isGateCreated) {
            await interaction.reply({ content: `Gate **${name}** is created!`, flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: `The gate name **${name}** is already in use`, flags: MessageFlags.Ephemeral });
        }

	},
};