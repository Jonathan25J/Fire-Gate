const { Events } = require('discord.js');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);
	},
};