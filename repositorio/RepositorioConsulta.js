import Consulta from "../Classes/Consulta.js";
import Paciente from "../Classes/Paciente.js";
import { DateTime } from 'luxon';

class RepositorioConsulta {

    /**
     * 
     * @param {object} consulta 
     * 
     * Adiciona uma consulta ao banco de dados
     */
    async addConsulta(consulta) {
        let consultas = await Consulta.findAll({ where: { dataConsulta: consulta.dataConsulta } });
        let i = consultas.findIndex(c => c.dataConsulta == consulta.dataConsulta && ((consulta.horaInicial >= c.horaInicial && consulta.horaInicial < c.horaFinal) ||
        (consulta.horaFinal > c.horaInicial && consulta.horaFinal <= c.horaFinal) ||
        (consulta.horaInicial <= c.horaInicial && consulta.horaFinal >= c.horaFinal)));
        if(await Paciente.findOne({ where: { cpf: consulta.cpf } }) == null){
            throw new Error("Paciente não encontrado");
        }
        else if(i != -1){
            throw new Error("Horário já ocupado");
        }
        else{
            await consulta.save();
        }
    }
        


    /**
     * 
     * @param {String} cpf 
     * @param {Date} dataConsulta 
     * @param {Date} horaInicial 
     * 
     * Remove uma consulta do banco de dados
     */
    async removeConsulta(cpf, dataConsulta, horaInicial) {
        dataConsulta = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy');
        dataConsulta = dataConsulta.toISODate();
        let i = await Consulta.destroy({ where: { cpf: cpf, dataConsulta: dataConsulta, horaInicial: horaInicial } });
        if(i == 0){
            throw new Error("Consulta não encontrada");
        }
    }

    /**
     * 
     * @param {date} dataInicio 
     * @param {date} dataFim 
     * 
     * Lista as consultas agendadas. Se informadasas datas desejadas, filtra por data de início e fim, se não, lista todas
     */
    async listarConsultas(dataInicio, dataFim) {
        let consultas = await Consulta.findAll({ order: [['dataConsulta', 'ASC'], ['horaInicial', 'ASC']] });
        let pacientes = await Paciente.findAll();
        if (dataInicio && dataFim) {
            dataInicio = DateTime.fromFormat(dataInicio, 'dd/MM/yyyy');
            dataFim = DateTime.fromFormat(dataFim, 'dd/MM/yyyy');
            if (!dataInicio.isValid || !dataFim.isValid) {
                throw new Error('Data inválida');
            }
            consultas = consultas.filter(c => c.dataConsulta >= dataInicio.toISODate() && c.dataConsulta <= dataFim.toISODate());
        }
        const maxTamanhoNome = Math.max(...pacientes.map(p => p.nome.length), 4);
        const linhaCabecalho = `${'CPF'.padEnd(11)} | ${'Nome'.padEnd(maxTamanhoNome)} | ${'Data'.padEnd(10)} | ${'Hora Inicial'.padEnd(12)} | ${'Hora Final'.padEnd(10)} | ${'Duração'.padEnd(7)}`;
        const linhaDivisoria = '-'.repeat(linhaCabecalho.length);

        console.log(linhaDivisoria);
        console.log(linhaCabecalho);
        console.log(linhaDivisoria);

        consultas.sort((a, b) => a.dataConsulta.localeCompare(b.dataConsulta));
        consultas.forEach(c => {
            
            // Formatação da hora, que vem em valor inteiro
            const formatarHora = (hora) => {
                const horaStr = hora.toString().padStart(4, '0');
                return `${horaStr.slice(0, 2)}:${horaStr.slice(2)}`; 
            };

            let horaInicial = formatarHora(c.horaInicial);
            let horaFinal = formatarHora(c.horaFinal);

            horaInicial = DateTime.fromFormat(horaInicial, 'HH:mm');
            horaFinal = DateTime.fromFormat(horaFinal, 'HH:mm');


            let duracao = horaFinal.diff(horaInicial, 'minutes').minutes;

            // Passa os minutos pro formato HH:mm
            const formatarDuracao = (minutos) => {
                const horas = Math.floor(minutos / 60);
                const minutosRestantes = minutos % 60;
                return `${horas.toString().padStart(2, '0')}:${minutosRestantes.toString().padStart(2, '0')}`;
            };

            duracao = formatarDuracao(duracao);

            const p = pacientes.find(p => p.cpf === c.cpf);
            console.log(
                `${c.cpf.padEnd(11)} | ${p.nome.padEnd(maxTamanhoNome)} | ${c.dataConsulta.split('-').reverse().join('/').padEnd(10)} | ${horaInicial.toFormat('HH:mm').toString().padEnd(12)} | ${horaFinal.toFormat('HH:mm').toString().padEnd(10)} | ${duracao.toString().padEnd(7)}`);
        });
    }
}


// Exporta uma instância de RepositorioConsulta
const repositorioConsulta = new RepositorioConsulta();

export default repositorioConsulta;