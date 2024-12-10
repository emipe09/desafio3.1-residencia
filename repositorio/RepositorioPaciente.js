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
        let consultas = await Consulta.findAll();
        pacientes.sort((a, b) => a.nome.localeCompare(b.nome));

        // Essa parte do código é responsável por formatar a saída de acordo com o tamanho dos campos de dados
        // O método Math.max() retorna o maior número de um ou mais números, nesse caso, o maior comprimento de CPF, nome, dataNasc e idade
        // Contando com o tamanho do titulo da coluna no cabeçalho
        const maxTamanhoNome = Math.max(...pacientes.map(p => p.nome.length), 4);
        const linhaCabecalho = `${'CPF'.padEnd(11)} | ${'Nome'.padEnd(maxTamanhoNome)} | ${'Dt.Nasc.'.padEnd(10)} | ${'Idade'.padEnd(5)}`;
        const linhaDivisoria = '-'.repeat(linhaCabecalho.length);

        console.log(linhaDivisoria);
        console.log(linhaCabecalho);
        console.log(linhaDivisoria);

        pacientes.forEach(p => {

            console.log(
                `${p.cpf.padEnd(11)} | ${p.nome.padEnd(maxTamanhoNome)} | ${p.dataNasc.padEnd(10)} | ${p.idade.toString().padStart(5)}`
            );

            const consultasDoPaciente = consultas.filter(c => c.cpf === p.cpf);
            consultasDoPaciente.forEach(c => {
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
        });

        console.log(linhaDivisoria);
    }

    /**
     * Lista os pacientes cadastrados na clínica em ordem crescente de CPF
     */
    async listarPacientesCpf() {
        let pacientes = await Paciente.findAll({ order: [['cpf', 'ASC']] });

        pacientes.sort((a, b) => a.cpf.localeCompare(b.cpf));

        const maxTamanhoNome = Math.max(...pacientes.map(p => p.nome.length), 4);
        const linhaCabecalho = `${'CPF'.padEnd(11)} | ${'Nome'.padEnd(maxTamanhoNome)} | ${'Dt.Nasc.'.padEnd(10)} | ${'Idade'.padEnd(5)}`;
        const linhaDivisoria = '-'.repeat(linhaCabecalho.length);

        console.log(linhaDivisoria);
        console.log(linhaCabecalho);
        console.log(linhaDivisoria);

        pacientes.forEach(p => {

            console.log(
                `${p.cpf.padEnd(11)} | ${p.nome.padEnd(maxTamanhoNome)} | ${p.dataNasc.padEnd(10)} | ${p.idade.toString().padStart(5)}`
            );
        });
        console.log(linhaDivisoria);
    }

}

// Exporta uma instância de RepositorioPaciente
const repositorioPaciente = new RepositorioPaciente();

export default repositorioPaciente;