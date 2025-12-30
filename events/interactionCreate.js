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

		// auto-defer if command takes longer than ~2.5s
		let deferTimer = setTimeout(async () => {
			if (!interaction.isRepliable()) return;
			if (!interaction.deferred && !interaction.replied) {
				try {
					await interaction.deferReply({ ephemeral: true });
				} catch (err) {
					logger.error('Failed to auto-defer interaction:', err);
				}
			}
		}, 2500);

		try {
			await command.execute(interaction);
			clearTimeout(deferTimer);
		} catch (error) {
			clearTimeout(deferTimer);
			logger.error(error);

			if (!interaction.isRepliable()) return;

			try {
				if (interaction.replied) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				} else if (interaction.deferred) {
					await interaction.editReply({ content: 'There was an error while executing this command!' });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			} catch (replyErr) {
				logger.error('Failed to notify user about command error:', replyErr);
			}
		}
	},
};