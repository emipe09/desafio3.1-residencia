/**
 * Configura a conexão com o banco de dados, utilizando o Sequelize
 * e passando as informações de conexão utilizadas em db.js
 */
const dbConfig = {
    database: "Consultorio",
    username: "postgres",
    password: "12345",
    host: "localhost",
    port: 5432,
    dialect: "postgres"
}

export default dbConfig;