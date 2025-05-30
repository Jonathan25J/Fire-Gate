const { Events, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));
const { isValidURL, isImageUrl } = require('../utils');
const userService = require('../database/management/services/userService');
const gatewayService = require('../database/management/services/gatewayService');
const spiritService = require('../database/management/services/spiritService');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.guild || message.author.bot) return;

        const userId = message.author.id;
        const user = await userService.getUserById(userId);

        if (!user) return;

        const gateway = await gatewayService.getGatewayFromUser(userId);

        if (!gateway) return;

        const gatewayUsers = (await gatewayService.getGatewayUsersByGateName(gateway.gate_name)).map(user => user.discord_user_id).filter(id => id != userId);

        if (gatewayUsers.length == 0) return;

        const spirit = await spiritService.getSpiritByName(gateway.spirit_name);

        const messageContent = message.content;
        const messageHasContent = messageContent.trim().length > 0;

        for (const user of gatewayUsers) {
            const receiver = await message.client.users.fetch(user);

            const embed = new EmbedBuilder()
                .setTitle(`${spirit.name}`)
                .setThumbnail(spirit.avatar)
                .setColor(spirit.color);

            if (messageHasContent && isValidURL(messageContent) ) {
                if (isImageUrl(messageContent)) {
                    embed.setImage(messageContent);
                } else if (messageContent.startsWith('https://tenor.com')) {
                    const redirectUrl = await getRedirectUrl(messageContent + '.gif');
                    embed.setImage(redirectUrl);
                } else {
                    embed.setDescription(messageContent);
                }
            } else if (messageHasContent) {
                embed.setDescription(messageContent);
            }

            if (message.attachments.size > 0 && message.attachments.first().contentType.startsWith('image')) {
                embed.setImage(message.attachments.first().url);
            }

            await receiver.send({ embeds: [embed] }).catch(err => {
                logger.error(err);
            });
        }
    },
};

async function getRedirectUrl(url) {
    const response = await fetch(url, { redirect: 'follow' });
    return response.url;
}