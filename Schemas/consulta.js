
/**
 * 
 * @param {object} Consulta 
 * @param {object} sequelize 
 * @param {object} DataTypes
 * 
 * Cria o modelo de Consulta, a partir da classe Consulta
 */
const createModelConsulta = (Consulta, sequelize, DataTypes) => {
    Consulta.init(
        {
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            dataConsulta: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                primaryKey: true,
            },
            horaInicial: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            horaFinal: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['cpf', 'dataConsulta', 'horaInicial'],
                    primaryKey: true,
                }
            ],
        }
    );
};

export default createModelConsulta;