import { Model } from 'sequelize';
import { DateTime } from 'luxon';

class Paciente extends Model {
    /**
     * Método para criar uma instância de Paciente
     * @param {*} cpf -- identificador único, 11 caracteres
     * @param {*} nome -- nome do paciente, mais de 5 caracteres
     * @param {*} dataNasc -- data de nascimento do paciente, no formato dd/MM/yyyy
     * @returns {Paciente} instância da classe Paciente
     */
    static of(cpf, nome, dataNasc) {
        if (cpf.length !== 11) {
            throw new Error("CPF inválido");
        }

        if (nome.length < 5) {
            throw new Error("Nome deve possuir mais de 5 caracteres");
        }

        let data = DateTime.fromFormat(dataNasc, 'dd/MM/yyyy');
        if (!data.isValid || data > DateTime.now()) {
            throw new Error("Data de nascimento inválida");
        }

        let idade = Math.trunc(DateTime.now().diff(data, 'years').years);
        if (idade < 13) {
            throw new Error("O dentista não atende menores de 13 anos");
        }
        return Paciente.build({ cpf, nome, dataNasc: data.toISODate(), idade});
    }
}

export default Paciente;