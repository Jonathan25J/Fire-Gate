const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const spiritService = require('../../database/management/services/spiritService');

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
				.setDescription('The URL of the spirit\'s avatar'))
		.addStringOption(option =>
			option.setName('color')
				.setDescription('Your spirit\'s color in hex format')),

	async execute(interaction) {
		const userId = interaction.user.id;
		const name = interaction.options.getString('name');
		const avatarUrl = interaction.options.getString('avatar_url');
		const color = interaction.options.getString('color');

		const user = await userService.getUserById(userId);

		if (!(user)) {
			await userService.createUser(userId);
		}

		if (avatarUrl && !isImageUrl(avatarUrl)) {
			return await interaction.reply({ content: 'Invalid image URL. Please provide a valid image URL that ends with an image file extension', flags: MessageFlags.Ephemeral });
		}

		if (color && !isHexColor(color)) {
			await interaction.reply({ content: 'Invalid color format. Please provide a valid hex color.', flags: MessageFlags.Ephemeral });
			return;
		}

		const isSpiritCreated = await spiritService.createSpirit(name, avatarUrl, color, userId);
		
		if (isSpiritCreated) {
			await interaction.reply({ content: `Spirit ${name} created!`, flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: `Spirit ${name} already exists.`, flags: MessageFlags.Ephemeral });
		}
	},
};

function isImageUrl(url) {
	const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
	return imageExtensions.test(url);
}

function isHexColor(value) {
    const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/;
    return hexPattern.test(value);
}
