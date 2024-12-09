import Paciente from "../Classes/Paciente.js";
import { DateTime } from 'luxon';


class RepositorioPaciente {
    async addPaciente(paciente) {
        if (paciente != null) await paciente.save();
    }

    async removePaciente(cpf) {
        await Paciente.destroy({ where: { cpf: cpf } });
    }

    async listarPacientesNome() {
        let pacientes = await Paciente.findAll({ order: [['nome', 'ASC']] });
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
        });

        console.log(linhaDivisoria);
    }

    async listarPacientesCpf() {
        return await Paciente.findAll({ order: [['cpf', 'ASC']] });
    }

}

const repositorioPaciente = new RepositorioPaciente();

export default repositorioPaciente;