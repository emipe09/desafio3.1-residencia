import Paciente from "../Classes/Paciente.js";
import Consulta from "../Classes/Consulta.js";


class RepositorioPaciente {
    /**
     * 
     * @param {object} paciente 
     * Adiciona um paciente ao banco de dados
     */
    async addPaciente(paciente) {
        if (await Paciente.findOne({ where: { cpf: paciente.cpf } }) == null) {
            await paciente.save();
        }
        else {
            throw new Error("Cpf já cadastrado");
        }
    }
    /**
     * 
     * @param {String} cpf 
     * Remove um paciente do banco de dados
     */
    async removePaciente(cpf) {
        let i = await Paciente.destroy({ where: { cpf: cpf } });
        if (i == 0) {
            throw new Error("Paciente não encontrado");
        }
    }

    /**
     * 
     * Lista os pacientes cadastrados na clínica, ordenados por nome e exibe as consultas agendadas
     */
    async listarPacientesNome() {
        let pacientes = await Paciente.findAll({ order: [['nome', 'ASC']] });
        await this.listarPaciente(pacientes);
    }

    /**
     * Lista os pacientes cadastrados na clínica em ordem crescente de CPF
     */
    async listarPacientesCpf() {
        let pacientes = await Paciente.findAll({ order: [['cpf', 'ASC']] });
        await this.listarPaciente(pacientes);

    }

    /**
     * 
     * @param {Array object}} pacientes 
     * 
     *  Essa parte do código é responsável por formatar a saída de acordo com o tamanho dos campos de dados
        O método Math.max() retorna o maior número de um ou mais números, nesse caso, o maior comprimento de CPF, nome, dataNasc e idade
        Contando com o tamanho do titulo da coluna no cabeçalho
     */
    async listarPaciente(pacientes){

        if (pacientes.length === 0) {
            console.log('Nenhum paciente cadastrado');
            return;
        }


        const maxTamanhoNome = Math.max(...pacientes.map(p => p.nome.length), 4);
        const linhaCabecalho = `${'CPF'.padEnd(11)} | ${'Nome'.padEnd(maxTamanhoNome)} | ${'Dt.Nasc.'.padEnd(10)} | ${'Idade'.padEnd(5)}`;
        const linhaDivisoria = '-'.repeat(linhaCabecalho.length);

        console.log(linhaDivisoria);
        console.log(linhaCabecalho);
        console.log(linhaDivisoria);

        for (const p of pacientes) {
            console.log(
                `${p.cpf.padEnd(11)} | ${p.nome.padEnd(maxTamanhoNome)} | ${p.dataNasc.padEnd(10)} | ${p.idade.toString().padStart(5)}`
            );

            await this.consultasDoPaciente(p.cpf);      
        }

        console.log(linhaDivisoria);
    }

    /**
     * 
     * @param {String} cpf 
     * 
     * Exibe as consultas agendadas para um paciente
     */
    async consultasDoPaciente(cpf) {
        let consultas = await Consulta.findAll({ where: { cpf: cpf } });
        consultas.forEach(c => {
            console.log(`  Agendado para: ${c.dataConsulta.split('-').reverse().join('/')}`);

            // Formatação da hora, que vem em valor inteiro
            const formatarHora = (hora) => {
            const horaStr = hora.toString().padStart(4, '0');
            return `${horaStr.slice(0, 2)}:${horaStr.slice(2)}`; 
            };

            let horaInicial = formatarHora(c.horaInicial);
            let horaFinal = formatarHora(c.horaFinal);

            console.log(`  ${horaInicial} às ${horaFinal}`);

        });
    }
        

}

// Exporta uma instância de RepositorioPaciente
const repositorioPaciente = new RepositorioPaciente();

export default repositorioPaciente;