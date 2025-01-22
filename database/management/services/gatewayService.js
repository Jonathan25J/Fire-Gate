const { connectionHandling, executeQuery } = require('../databaseManagement');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

class GatewayService {
    constructor() {
    }

    async createGateway(client, discordUserId, gateName, SpiritName) {
        const queryText = 'INSERT INTO gateway (discord_user_id, gate_name, spirit_name) VALUES ($1, $2, $3) ON CONFLICT (discord_user_id) DO NOTHING RETURNING *;';
        const values = [discordUserId, gateName, SpiritName];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gateway created:', result[0]);
        } else {
            logger.debug('A gateway with the user already exists or no rows were returned.');
        }

        return result && result.length > 0;
    }

    async getGatewayFromUser(client, discordUserId) {
        const queryText = 'SELECT * FROM gateway WHERE discord_user_id = $1;';
        const values = [discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gateway retrieved:', result[0]);
        } else {
            logger.debug('No gateway found for the given user.');
        }

        return result && result.length > 0 ? result[0] : null;
    }

    async removeGatewayByUser(client, discordUserId) {
        const queryText = 'DELETE FROM gateway WHERE discord_user_id = $1 RETURNING *;';
        const values = [discordUserId];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            logger.debug('Gateway removed:', result[0]);
        } else {
            logger.debug('No gateway found or could not be removed.');
        }

        return result && result.length > 0;
    }

    async getGatewayUsersByGateName(client, gateName) {
        const queryText = 'SELECT discord_user_id FROM gateway WHERE gate_name = $1;';
        const values = [gateName];
        const result = await executeQuery(client, queryText, values);
    
        if (result && result.length > 0) {
            logger.debug('Users retrieved for gate name:', gateName, result);
        } else {
            logger.debug('No users found for the given gate name.');
        }
    
        return result;
    }

}

// Wrap the methods with connection handling
Object.getOwnPropertyNames(GatewayService.prototype).forEach((methodName) => {
    if (methodName !== 'constructor') {
        const originalMethod = GatewayService.prototype[methodName];
        GatewayService.prototype[methodName] = connectionHandling(originalMethod);
    }
});

const gatewayService = new GatewayService();

module.exports = gatewayService;
