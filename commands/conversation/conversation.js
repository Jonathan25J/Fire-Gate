const { SlashCommandBuilder } = require('discord.js');
const startCommand = require('./start');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('conversation')
		.setDescription('Manage conversations with users')
		.addSubcommand(startCommand.data),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'start') {
			await startCommand.execute(interaction);
		}
	},
};
