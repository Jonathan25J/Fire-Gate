const { SlashCommandSubcommandBuilder } = require('discord.js');
const userService = require('../../database/management/services/userService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('create')
		.setDescription('Create a new spirit')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the spirit')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('avatar_url')
				.setDescription('The URL of the spirit\'s avatar')),

	async execute(interaction) {
		const userId = interaction.user.id; 
		const name = interaction.options.getString('name');
		const avatarUrl = interaction.options.getString('avatar_url');

		const user = await userService.getUserById(userId);

		if (user) {
			console.log(`Creating a new spirit for user: ${userId}, Name: ${name}, Avatar: ${avatarUrl}`);
		} else {
			console.log(`User ${userId} not found in the database.`);
			await interaction.reply({ content: 'User not found. Please register first.', ephemeral: true });
		}
		
	},
};
