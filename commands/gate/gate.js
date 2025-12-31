const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const createCommand = require('./create');
const listCommand = require('./list');
const removeCommand = require('./remove');
const openCommand = require('./open');
const closeCommand = require('./close');
const currentCommand = require('./current');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gate')
		.setDescription('Spirit can gather by gates')
		.addSubcommand(createCommand.data)
        .addSubcommand(listCommand.data)
        .addSubcommand(removeCommand.data)
        .addSubcommand(openCommand.data)
        .addSubcommand(closeCommand.data)
        .addSubcommand(currentCommand.data),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
            case 'create':
                await createCommand.execute(interaction);
                break;
            case 'list':
                await listCommand.execute(interaction);
                break;
            case 'remove':
                await removeCommand.execute(interaction);
                break;
            case 'open':
                await openCommand.execute(interaction);
                break;
            case 'close':
                await closeCommand.execute(interaction);
                break;
            case 'current':
                await currentCommand.execute(interaction);
                break;
            default:
                await interaction.reply({ content: 'Unknown subcommand', flags: MessageFlags.Ephemeral });
                break;
        }
	},
};
