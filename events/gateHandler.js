const { Events, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));
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
                const isImage = await isImageUrl(messageContent);
                if (isImage) {
                    embed.setImage(messageContent);
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

function isValidURL(string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i')
    return urlPattern.test(string);
}

async function isImageUrl(url) {
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith('image/')
}