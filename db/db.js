import { Sequelize } from 'sequelize';
import Consulta from '../Classes/Consulta.js';
import Paciente from '../Classes/Paciente.js';
import dbConfig from './config.js';
import createModelConsulta from '../Schemas/consulta.js';
import createModelPaciente from '../Schemas/paciente.js';

class Db {
    #sequelize;

    async init() {
        this.#sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            {
                host: dbConfig.host,
                dialect: dbConfig.dialect,
                logging: false,
            }
        );

        try {
            await this.#sequelize.authenticate();
            console.log("Conexão com o banco de dados estabelecida com sucesso!");
        } catch (error) {
            console.error("Erro ao conectar ao banco de dados:", error);
            return false;
        }

        // Criar os modelos
        createModelConsulta(Consulta, this.#sequelize, Sequelize.DataTypes);
        createModelPaciente(Paciente, this.#sequelize, Sequelize.DataTypes);

        // Configurar relações
        Paciente.hasMany(Consulta, { foreignKey: 'cpf', sourceKey: 'cpf' });
        Consulta.belongsTo(Paciente, { foreignKey: 'cpf', targetKey: 'cpf' });

        return true;
    }

    get Sequelize() {
        return this.#sequelize;
    }
}

const db = new Db();

export default db;
