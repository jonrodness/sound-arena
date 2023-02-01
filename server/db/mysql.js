const mysql = require('mysql');
const fs = require('fs');

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  connectionLimit: 10,
};
let pool;

// Need to connect to Cloud SQL db using TLS iff development
if (process.env.NODE_ENV === 'development') {
  options.ssl = {
    ca: fs.readFileSync(`${__dirname}/../../../sec/mysql/qa/server-ca.pem`),
    key: fs.readFileSync(`${__dirname}/../../../sec/mysql/qa/client-key.pem`),
    cert: fs.readFileSync(`${__dirname}/../../../sec/mysql/qa/client-cert.pem`),
  };
} else {
  options.socketPath = `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
}

const db = {
  connect: () => {
    pool = mysql.createPool(options);

    pool.on('connection', (connection) => {
    });

    pool.on('error', (err) => {
      console.error('Connection err', err);
    });

    pool.on('acquire', (connection) => {
      console.log('Connection %d acquired', connection.threadId);
    });

    pool.on('enqueue', () => {
      console.log('Waiting for available connection slot');
    });

    pool.on('release', (connection) => {
      console.log('Connection %d released', connection.threadId);
    });
  },

  queryAsync: async (statement) => await new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);

      else {
        connection.query(statement, (error, results, fields) => {
          connection.release();
          if (error) reject(error);
          else resolve(results);
        });
      }
    });
  }),

  query: (statement, cb) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      else {
        const stream = connection.query(statement, cb);
        stream.on('end', () => {
          connection.release();
        });
      }
    });
  },

  queryForStream: async (statement) => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else {
        const stream = connection.query(statement);
        stream.on('end', () => {
          connection.release();
        });
        resolve(stream);
      }
    });
  }),
};

module.exports = db;
