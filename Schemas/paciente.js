

const createModelPaciente = (Paciente, sequelize, DataTypes) => {
    Paciente.init(
        {
            cpf: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dataNasc: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            idade: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ['cpf']
                }
            ],
        }
    );
};

export default createModelPaciente;