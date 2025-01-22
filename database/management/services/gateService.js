const { connectionHandling, executeQuery } = require('../databaseManagement');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

class GateService {
    constructor() {
    }

    async createGate(client, name, discordUserId) {
        const queryText = 'INSERT INTO gate (name, discord_user_id) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING *;';
        const values = [name, discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gate created:', result[0]);
        } else {
            logger.debug('The gate already exits or no rows were returned.');
        }

        return result && result.length > 0;
    }

    async getGatesFromUser(client, discordUserId) {
        const queryText = 'SELECT * FROM gate WHERE discord_user_id = $1;';
        const values = [discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gates retrieved:', result);
        } else {
            logger.debug('No gates found for the given user.');
        }

        return result && result.length > 0 ? result : null;
    }

    async getGateByName(client, name) {
        const queryText = 'SELECT * FROM gate WHERE name = $1;';
        const values = [name];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gate retrieved:', result[0]);
        } else {
            logger.debug('No gate found with the given name.');
        }

        return result && result.length > 0 ? result[0] : null;
    }

    async removeGateByNameAndUser(client, name, discordUserId) {
        try {
            const queryText = 'DELETE FROM gate WHERE name = $1 AND discord_user_id = $2 RETURNING *;';
            const values = [name, discordUserId];
            const result = await executeQuery(client, queryText, values);

            if (result && result.length > 0) {
                logger.debug('Gate removed:', result[0]);
            } else {
                logger.debug('No gate found or could not be removed.');
            }

            return result && result.length > 0;
        } catch (error) {
            logger.error('Error removing gate:', error);
            return null;
        }
    }

}

// Wrap the methods with connection handling
Object.getOwnPropertyNames(GateService.prototype).forEach((methodName) => {
    if (methodName !== 'constructor') {
        const originalMethod = GateService.prototype[methodName];
        GateService.prototype[methodName] = connectionHandling(originalMethod);
    }
});

const gateService = new GateService();

module.exports = gateService;
