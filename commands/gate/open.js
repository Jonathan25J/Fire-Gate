const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const gateService = require('../../database/management/services/gateService');
const spiritService = require('../../database/management/services/spiritService');
const gatewayService = require('../../database/management/services/gatewayService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('open')
        .setDescription('Open a gate')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the gate you want to open')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('spirit')
                .setDescription('The name of the spirit that will go trough the gate')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const gateName = interaction.options.getString('name');
        const spiritName = interaction.options.getString('spirit');

        const user = await userService.getUserById(userId);

        if (!(user)) {
            return await interaction.reply({ content: 'You don\'t have any spirits that you can use to go trough the gate', flags: MessageFlags.Ephemeral });
        }

        const gate = await gateService.getGateByName(gateName);

        if (!gate) {
            return await interaction.reply({ content: `The gate **${gateName}** does not exist`, flags: MessageFlags.Ephemeral });
        }

        const spirit = await spiritService.getSpiritByName(spiritName);

        if (!spirit || spirit.discord_user_id !== userId) {
            return await interaction.reply({ content: `The spirit **${spiritName}** does not exist here`, flags: MessageFlags.Ephemeral });
        }

        const gateway = await gatewayService.getGatewayFromUser(userId);

        if (gateway) {
            return await interaction.reply({ content: `You already have a port open to **${gateway.gate_name}**`, flags: MessageFlags.Ephemeral });
        }

        const isGatewayCreated = await gatewayService.createGateway(userId, gateName, spiritName);

        if (isGatewayCreated) {
            if (interaction.guild) {
                await interaction.reply({ content: `The gate has been opened`, flags: MessageFlags.Ephemeral });
                return await interaction.user.send({ content: `The gate **${gateName}** is now open for **${spiritName}**` });
            } else {
                return await interaction.reply({ content: `The gate **${gateName}** is now open for **${spiritName}**` });
            }
        } else {
            return await interaction.reply({ content: `The gate **${gateName}** could not be opened for **${spiritName}**`, flags: MessageFlags.Ephemeral });
        }

    },
};