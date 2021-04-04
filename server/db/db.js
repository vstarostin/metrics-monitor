const { Pool } = require("pg");

module.exports = new Pool({
    user: "postgres",
    password: "password",
    database: "monitor",
    host: "localhost",
    port: 5432
})

// const { Sequelize } = require("sequelize");

// const pool = new Sequelize("monitor", "postgres", "password", {
//     host: "localhost",
//     dialect: "postgres",
//     port: 5432
// });

// module.exports = pool;