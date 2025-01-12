const { SlashCommandBuilder } = require('discord.js');
const startCommand = require('./create');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spirit')
		.setDescription('Spirits can go trough the fire gate')
		.addSubcommand(startCommand.data),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'create') {
			await startCommand.execute(interaction);
		}
	},
};
