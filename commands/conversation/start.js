const { SlashCommandSubcommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('start')
		.setDescription('Starts a conversation with someone.')
		.addStringOption(option =>
			option.setName('user_id')
				.setDescription('The user ID of the person you want to start a conversation with')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want to send')
				.setRequired(true)),

	async execute(interaction) {
		const userID = interaction.options.getString('user_id');
		const message = interaction.options.getString('message');
		try {
			const user = await interaction.client.users.fetch(userID);
			await user.send(message);
			await interaction.reply(`Message sent to <@${userID}>: "${message}"`);
		} catch (error) {
			await interaction.reply('Failed to send message. Ensure the user ID is correct or the user has DMs disabled.');
		}
	},
};
