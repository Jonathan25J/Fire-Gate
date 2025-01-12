const { Client } = require('pg');
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
          console.debug('Already connected to the database');
          return; 
      }
      await client.connect();
      console.debug('Connected to the database');
  } catch (err) {
      console.error('Connection error', err.stack);
      throw err;
  }
}

async function executeQuery(client, queryText, values) {
  try {
    const res = await client.query(queryText, values);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
}

async function closeConnection(client) {
    try {
      await client.end();
      console.debug('Database connection closed');
    } catch (err) {
      console.error('Error closing connection', err.stack);
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
        console.error(`Error during ${func.name}:`, error);
        throw error;
      } finally {
        await closeConnection(client);
      }
    };
  }

module.exports = { connectionHandling, executeQuery };
