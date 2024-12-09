import Consulta from "../Classes/Consulta.js";
import { DateTime } from 'luxon';

class RepositorioConsulta {

    async addConsulta(consulta) {
        if (consulta != null) await consulta.save();
    }

    async removeConsulta(cpf, dataConsulta, horaInicial) {
        await Consulta.destroy({ where: { cpf: cpf, dataConsulta: dataConsulta, horaInicial: horaInicial } });
    }

    async listarConsultas() {
        return await Consulta.findAll({ order: [['dataConsulta', 'ASC'], ['horaInicial', 'ASC']] });
    }

}

const repositorioConsulta = new RepositorioConsulta();

export default repositorioConsulta;