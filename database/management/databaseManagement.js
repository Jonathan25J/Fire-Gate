const { Client } = require('pg');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));
require('dotenv').config();

function createClient() {
  return new Client({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT,
  });
}

async function createConnection(client) {
  try {
      if (client._connected) {
          logger.debug('Already connected to the database');
          return; 
      }
      await client.connect();
      logger.debug('Connected to the database');
  } catch (err) {
      logger.error('Connection error', err.stack);
      throw err;
  }
}

async function executeQuery(client, queryText, values) {
  try {
    const res = await client.query(queryText, values);
    return res.rows;
  } catch (err) {
    logger.error('Error executing query', err.stack);
    throw err;
  }
}

async function closeConnection(client) {
    try {
      await client.end();
      logger.debug('Database connection closed');
    } catch (err) {
      logger.error('Error closing connection', err.stack);
    }
  }

  function connectionHandling(func) {
    return async function (...args) {
      const client = createClient();
      try {
        await createConnection(client);
        const result = await func(client, ...args);
        return result;
      } catch (error) {
        logger.error(`Error during ${func.name}:`, error);
        throw error;
      } finally {
        await closeConnection(client);
      }
    };
  }

module.exports = { connectionHandling, executeQuery };
