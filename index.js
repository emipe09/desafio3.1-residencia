import promptSync from 'prompt-sync';
const readline = promptSync();

import db from "./db/db.js";
import Consulta from "./Classes/Consulta.js";
import Paciente from "./Classes/Paciente.js";
import repositorioConsulta from './repositorio/RepositorioConsulta.js';
import repositorioPaciente from './repositorio/RepositorioPaciente.js';


// Inicializa o banco de dados
const inicializado = await db.init();

// Verifica se a conexão com o banco de dados foi estabelecida com sucesso
if(!inicializado){
    console.log("Erro ao conectar com o banco de dados");
    process.exit();
}

/**
 * Menu principal
 */

async function menuPrincipal() {
    try {
        console.log('\n\n* Menu Principal* \n-------------------------------------------------------------------------------');
        console.log('1 - Cadastro de Paciente\n2 - Agenda\n3 - Fim');
        console.log('-------------------------------------------------------------------------------');
        let i = Number(readline('Escolha uma opção: '));
        if (i == 1) {
            await menuPaciente();
        }
        else if (i == 2) {
            await menuAgenda();
        }
        else if (i == 3) {
            console.log('Fim');
        }
        else {
            throw new Error('Opção inválida');
        }
    }
    catch (e) {
        console.log('Erro: ' + e.message);
        if(e.message == 'Opção inválida'){
            await menuPrincipal();
        }
    }
}

/**
 * Menu do cadastro de pacientes
 */
async function menuPaciente(){
    console.log('\n\n* Menu do Cadastro de Pacientes *\n-------------------------------------------------------------------------------');
    console.log("1 - Cadastrar novo paciente\n2 - Excluir paciente\n3 - Listar pacientes por nome\n4 - Listar pacientes por CPF");
    console.log("5 - Voltar p/ menu principal");
    console.log('-------------------------------------------------------------------------------');

    let j = Number(readline('Escolha uma opção: '));
    if (j == 1) {
        let cadastroRealizado = false;
        while (!cadastroRealizado) {
            try {
                let cpf = readline('Digite o CPF: ');
                let nome = readline('Digite o nome: ');
                let dataNasc = readline('Digite a data de nascimento: ');
                let paciente = Paciente.of(cpf, nome, dataNasc);
                await repositorioPaciente.addPaciente(paciente);
                console.log('Paciente cadastrado com sucesso!');
                cadastroRealizado = true;
            }
            catch (e) {
                console.log(e.message);
                console.log("Por favor, insira os dados novamente.\n");
            }
    }
        await menuPaciente();
    }
    else if(j==2){
        try {
            let cpf = readline('Digite o CPF do paciente a ser excluído: ');
            await repositorioPaciente.removePaciente(cpf);
        }
        catch(e){
            console.log("Erro: " + e.message);
        }
        await menuPaciente();
    }
    else if(j==3){
        await repositorioPaciente.listarPacientesNome();
        await menuPaciente();
    }
    else if(j==4){
        await repositorioPaciente.listarPacientesCpf();
        await menuPaciente();
    }
    else if(j==5){
        await menuPrincipal();
    }
    else{
        throw new Error('Opção inválida');
    }

}
/**
 * Menu da agenda
 */
async function menuAgenda(){
    console.log('\n\n* Menu da Agenda *\n-------------------------------------------------------------------------------');
    console.log("1 - Agendar consulta\n2 - Cancelar consulta\n3 - Listar agenda\n4 - Voltar p/ menu principal");
    console.log('-------------------------------------------------------------------------------');

    let j = Number(readline('Escolha uma opção: '));
    if(j==1){
        let consultaAgendada = false;
        while (!consultaAgendada) {
            try {
                let cpf = readline('Digite o CPF do paciente: ');
                let data = readline('Digite a data da consulta: ');
                let horaInicial = Number(readline('Digite a hora inicial: '));
                let horaFinal = Number(readline('Digite a hora final: '));
                let consulta = Consulta.of(cpf, data, horaInicial, horaFinal);
                await repositorioConsulta.addConsulta(consulta); 
                console.log("Consulta agendada com sucesso!");
                consultaAgendada = true;
            } catch (e) {
                console.log("Erro: " + e.message);
                console.log("Por favor, insira os dados novamente.\n");
            }
        }
        await menuAgenda();
    }
    else if(j==2){
        let consultaCancelada = false;
        while (!consultaCancelada) {
            try {
                let cpf = readline('Digite o CPF do paciente da consulta: ');
                let data = readline('Digite a data da consulta: ');
                let horaInicial = Number(readline('Digite a hora inicial da consulta: '));
                await repositorioConsulta.removeConsulta(cpf, data, horaInicial);
                console.log("Consulta cancelada com sucesso!");
                consultaCancelada = true;
            }
            catch (e) {
                console.log("Erro: " + e.message);
                console.log("Por favor, insira os dados novamente.\n");
            }
        }
        await menuAgenda();
    }
    else if(j==3){
        console.log('Apresentar a agenda toda (T) ou apenas um período de datas (P)?');
        let op = readline('Escolha uma opção: ');
        op = op.toUpperCase();
        if(op=='T'){
            await repositorioConsulta.listarConsultas();
        }
        else if(op=='P'){
            let dataInicio = readline('Digite a data de início: ');
            let dataFim = readline('Digite a data de fim: ');
            await repositorioConsulta.listarConsultas(dataInicio, dataFim);
        }
        await menuAgenda();
    }
    else if(j==4){
        await menuPrincipal();
    }
    else{
        throw new Error('Opção inválida');
    }

}

// Inicia a aplicação
try{
    await menuPrincipal();
}
catch(e){
    console.log('Erro: ' + e.message);
}

