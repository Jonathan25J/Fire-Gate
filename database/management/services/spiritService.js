const { connectionHandling, executeQuery } = require('../databaseManagement');

class SpiritService {
    constructor() {
    }

    async createSpirit(client, name, avatar, color, discordUserId) {
        const queryText = 'INSERT INTO spirit (name, avatar, color, discord_userid) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING *;';
        const values = [name, avatar, color, discordUserId];
        const result = await executeQuery(client, queryText, values);
        return result && result.length > 0;
    }

    async getSpiritByName(client, name) {
        const queryText = 'SELECT * FROM spirit WHERE name = $1;';
        const values = [name];
        const result = await executeQuery(client, queryText, values);

        if (result && result.length > 0) {
            console.log('Spirit found:', result[0]);
            return result[0];
        } else {
            console.log('Spirit not found');
            return null;
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