const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('message')
		.setDescription('Message a user with your spirit')
		.addStringOption(option =>
			option.setName('user')
				.setDescription('The name of the user you want to message')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('spirit')
				.setDescription('Which spirit you want to use')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want to send')
				.setRequired(true)),

	async execute(interaction) {
		const userId = interaction.user.id;
		const GivenUserTarget = await identifyTargetUser(interaction.options.getString('user'));
		const GivenSpirit = interaction.options.getString('spirit');
		const message = interaction.options.getString('message');

		const user = await userService.getUserById(userId);

		if (!(user)) {
			return await interaction.reply({ content: 'You need to create a spirit first. Please use the `/spirit create` command to create one.', flags: MessageFlags.Ephemeral });
		}

		let userTarget = null;
		if (GivenUserTarget !== undefined) {
			userTarget = await interaction.client.users.fetch(GivenUserTarget);
		}

		if (!userTarget) {
			return await interaction.reply({ content: 'The spirit or user you are trying to message does not exist.', flags: MessageFlags.Ephemeral });
		}

		const spirit = await spiritService.getSpiritByName(GivenSpirit);

		if (!spirit) {
			return await interaction.reply({ content: 'The spirit you are trying to use does not exist.', flags: MessageFlags.Ephemeral });
		}

		const embed = new EmbedBuilder()
			.setTitle(spirit.name)
			.setThumbnail(spirit.avatar)
			.setDescription(message)
			.setFooter({ text: `Reply with: \`/spirit message ${spirit.name} [your spirit] [message]\`` })
			.setColor(spirit.color);

		await userTarget.send({ embeds: [embed] });

		await interaction.reply({ embeds: [embed] });

	},
};

async function identifyTargetUser(user) {
	const userIdRegex = /^\d+$/;
	const mentionRegex = /^<@!?(\d+)>$/;

	if (userIdRegex.test(user)) {
		return user;
	}

	if (mentionRegex.test(user)) {
		return user.replace(/[<@!>]/g, '');
	}
	
	return (await spiritService.getSpiritByName(user)).discord_user_id;
}
