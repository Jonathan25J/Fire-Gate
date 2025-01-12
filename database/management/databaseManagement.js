const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,
});

async function createConnection() {
    try {
      await client.connect();
      console.log('Connected to database');
    } catch (err) {
      console.error('Connection error', err.stack);
      throw err;
    }
  }  

async function executeQuery(queryText, values) {
  try {
    const res = await client.query(queryText, values);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
}

async function closeConnection() {
    try {
      await client.end();
      console.log('Database connection closed');
    } catch (err) {
      console.error('Error closing connection', err.stack);
    }
  }

function connectionHandling(func) {
    return async function (...args) {
      try {
        await createConnection(); 
        const result = await func(...args); 
        return result;
      } catch (error) {
        console.error(`Error during ${func.name}:`, error);
        throw error; 
      } finally {
        await closeConnection();
      }
    };
  }

module.exports = { connectionHandling, executeQuery };
