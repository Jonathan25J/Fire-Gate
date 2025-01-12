const { connectionHandling, executeQuery } = require('../databaseManagement');

class UserService {
  constructor() {
  }

  async createUser(client, userId) {
    const queryText = 'INSERT INTO discord_user (id) VALUES ($1) ON CONFLICT (id) DO NOTHING RETURNING *;';
    const values = [userId];
    const result = await executeQuery(client, queryText, values);
    return result && result.length > 0;
  }

  async getUserById(client, userId) {
    const queryText = 'SELECT * FROM discord_user WHERE id = $1;';
    const values = [userId];
    const result = await executeQuery(client, queryText, values);

    if (result && result.length > 0) {
      console.debug('User found:', result[0]);
      return result[0];
    } else {
      console.debug('User not found');
      return null;
    }
  }

  async deleteUserById(client, userId) {
    const queryText = 'DELETE FROM discord_user WHERE id = $1 RETURNING *;';
    const values = [userId];
    const result = await executeQuery(client, queryText, values);
    return result && result.length > 0;
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
