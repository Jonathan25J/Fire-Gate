const { connectionHandling, executeQuery } = require('../databaseManagement');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

class UserService {
  constructor() {
  }

  async createUser(client, userId) {
    const queryText = 'INSERT INTO discord_user (id) VALUES ($1) ON CONFLICT (id) DO NOTHING RETURNING *;';
    const values = [userId];
    const result = await executeQuery(client, queryText, values);

    if (result && result.length > 0) {
      logger.debug('User created:', result[0]);
    } else {
      logger.debug('User already exists or no rows were returned.');
    }

    return result && result.length > 0;
  }

  async getUserById(client, userId) {
    const queryText = 'SELECT * FROM discord_user WHERE id = $1;';
    const values = [userId];
    const result = await executeQuery(client, queryText, values);

    if (result && result.length > 0) {
      logger.debug('User found:', result[0]);
    } else {
      logger.debug('User not found');
    }

    return result && result.length > 0 ? result[0] : null;
  }

}

// Wrap the methods with connection handling
Object.getOwnPropertyNames(UserService.prototype).forEach((methodName) => {
  if (methodName !== 'constructor') {
    const originalMethod = UserService.prototype[methodName];
    UserService.prototype[methodName] = connectionHandling(originalMethod);
  }
});

const userService = new UserService();

module.exports = userService;
