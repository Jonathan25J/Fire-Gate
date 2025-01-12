const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const createCommand = require('./create');
const messageCommand = require('./message');
const listCommand = require('./list');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spirit')
		.setDescription('Spirits can go trough the fire gate')
		.addSubcommand(createCommand.data)
		.addSubcommand(messageCommand.data)
		.addSubcommand(listCommand.data),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
            case 'create':
                await createCommand.execute(interaction);
                break;
            case 'message':
                await messageCommand.execute(interaction);
                break;
			case 'list':
				await listCommand.execute(interaction);
				break;
            default:
                await interaction.reply({ content: 'Unknown subcommand', flags: MessageFlags.Ephemeral });
                break;
        }
	},
};
