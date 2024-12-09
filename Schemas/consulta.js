

const createModelConsulta = (Consulta, sequelize, DataTypes) => {
    Consulta.init(
        {
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [11, 11]
                }
            },
            dataConsulta: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true,
                    isAfter: new Date().toISOString()
                }
            },
            horaInicial: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 800,
                    max: 1900,
                    is: /^[0-9]{4}$/
                }
            },
            horaFinal: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 800,
                    max: 1900,
                    is: /^[0-9]{4}$/
                }
            }
        },
        {
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ['cpf', 'dataConsulta', 'horaInicial']
                }
            ],
        }
    );
};

export default createModelConsulta;