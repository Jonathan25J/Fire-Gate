const { SlashCommandSubcommandBuilder, MessageFlags } = require('discord.js');
const userService = require('../../database/management/services/userService');
const spiritService = require('../../database/management/services/spiritService');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('edit')
        .setDescription('Edit a spirit')
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
        let avatarUrl = interaction.options.getString('avatar_url');
        let color = interaction.options.getString('color');

        const user = await userService.getUserById(userId);

        if (!(user)) {
            return await interaction.reply({ content: 'You need to create a spirit first. Please use the `/spirit create` command to create one', flags: MessageFlags.Ephemeral });
        }

        const spirit = await spiritService.getSpiritByName(name);

        if (!spirit || spirit.discord_user_id !== userId) {
            return await interaction.reply({ content: `The spirit **${name}** does not exist here`, flags: MessageFlags.Ephemeral });
        }

        if (!avatarUrl && !color) {
            return await interaction.reply({ content: 'You need to provide at least one field to edit', flags: MessageFlags.Ephemeral });
        }

        if (avatarUrl && !isImageUrl(avatarUrl)) {
            return await interaction.reply({ content: 'Invalid image URL. Please provide a valid image URL that ends with an image file extension', flags: MessageFlags.Ephemeral });
        } else if (!avatarUrl) {
            avatarUrl = spirit.avatar;
        }

        if (color && !isHexColor(color)) {
            return await interaction.reply({ content: 'Invalid color format. Please provide a valid hex color', flags: MessageFlags.Ephemeral });
        } else if (!color) {
            color = spirit.color;
        }

        const isSpiritEdited = await spiritService.editSpirit(name, avatarUrl, color, userId);

        if (isSpiritEdited) {
            await interaction.reply({ content: `Spirit **${name}** has been edited!`, flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: `The spirit **${name}** could not be edited`, flags: MessageFlags.Ephemeral });
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
