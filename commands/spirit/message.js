const { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('message')
		.setDescription('Message a user with your spirit')
		.addStringOption(option =>
			option.setName('user-or-spirit')
				.setDescription('The name of the user or spirit you want to message')
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
		const userOrSpirit = interaction.options.getString('user-or-spirit');
		const GivenReceiver = await identifyReceiver(userOrSpirit);
		const GivenSpirit = interaction.options.getString('spirit');
		const message = interaction.options.getString('message');

		const user = await userService.getUserById(userId);

		if (!(user)) {
			return await interaction.reply({ content: 'You need to create a spirit first. Please use the `/spirit create` command to create one.', flags: MessageFlags.Ephemeral });
		}

		let receiver = null;
		if (GivenReceiver !== undefined) {
			receiver = await interaction.client.users.fetch(GivenReceiver);
		}

		if (!receiver) {
			return await interaction.reply({ content: 'The spirit or user you are trying to message does not exist.', flags: MessageFlags.Ephemeral });
		}

		const spirit = await spiritService.getSpiritByName(GivenSpirit);

		if (!spirit) {
			return await interaction.reply({ content: 'The spirit you are trying to use does not exist.', flags: MessageFlags.Ephemeral });
		}

		const embed = new EmbedBuilder()
			.setTitle( `${spirit.name} -> ${userOrSpirit}`)
			.setThumbnail(spirit.avatar)
			.setDescription(message)
			.setFooter({ text: `Reply with: \`/spirit message ${spirit.name} [your spirit] [message]\`` })
			.setColor(spirit.color);

		await receiver.send({ embeds: [embed] });

		await interaction.reply({ embeds: [embed] });

	},
};

async function identifyReceiver(receiver) {
	const userIdRegex = /^\d+$/;
	const mentionRegex = /^<@!?(\d+)>$/;

	if (userIdRegex.test(receiver)) {
		return receiver;
	}

	if (mentionRegex.test(receiver)) {
		return receiver.replace(/[<@!>]/g, '');
	}

	const spirit = await spiritService.getSpiritByName(receiver);

	if (spirit !== null) {
		return spirit.discord_user_id;
	} else {
		return undefined;
	}
}
