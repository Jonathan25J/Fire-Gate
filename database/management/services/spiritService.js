const { connectionHandling, executeQuery } = require('../databaseManagement');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

class SpiritService {
    constructor() {
    }

    async createSpirit(client, name, avatar, color, discordUserId) {
        const queryText = 'INSERT INTO spirit (name, avatar, color, discord_user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING *;';
        const values = [name, avatar, color, discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Spirit created:', result[0]);
          } else {
            logger.debug('Spirit already exists or no rows were returned.');
          }

        return result && result.length > 0;
    }

    async getSpiritByName(client, name) {
        const queryText = 'SELECT * FROM spirit WHERE name = $1;';
        const values = [name];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Spirit found:', result[0]);
            return result[0];
        } else {
            logger.debug('Spirit not found');
            return null;
        }
    }

    async getSpiritsFromUser(client, discordUserId) {
        const queryText = 'SELECT * FROM spirit WHERE discord_user_id = $1;';
        const values = [discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Spirits found for user:', result);
            return result;
        } else {
            logger.debug('No spirits found for user');
            return [];
        }
    }
}

// Wrap the methods with connection handling
Object.getOwnPropertyNames(SpiritService.prototype).forEach((methodName) => {
    if (methodName !== 'constructor') {
        const originalMethod = SpiritService.prototype[methodName];
        SpiritService.prototype[methodName] = connectionHandling(originalMethod);
    }
});

const spiritService = new SpiritService();
module.exports = spiritService;