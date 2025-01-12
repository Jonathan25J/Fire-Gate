const { Events, MessageFlags } = require('discord.js');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		// Check if the interaction is in a server
		if (interaction.guild) {
			return await interaction.reply({ content: 'You can only use this bot inside your DM for security reasons.', flags: MessageFlags.Ephemeral });
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};