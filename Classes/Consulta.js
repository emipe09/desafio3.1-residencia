import { Model } from 'sequelize';
import { DateTime} from 'luxon';

class Consulta extends Model{
    /**
     * 
     * @param {*} cpf -- identificador único do paciente para a consulta
     * @param {*} dataConsulta -- data da consulta no formato dd/MM/yyyy
     * @param {*} horaInicial -- hora de início da consulta no formato HHmm
     * @param {*} horaFinal -- hora de término da consulta no formato HHmm
     * Aplica as regras de validação para a criação de uma consulta 
     * e lança um erro caso a data ou horário inválido
     */
    static of(cpf, dataConsulta, horaInicial, horaFinal){
        dataConsulta = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy');
        if((horaInicial>800 && horaInicial<1900) && (horaFinal>horaInicial)
            &&((dataConsulta.isValid && dataConsulta > DateTime.now()))
            &&((horaInicial%100)%15 == 0 && (horaFinal%100)%15 == 0)){    
                return Consulta.build(({cpf, dataConsulta, horaInicial, horaFinal}));
            }                
        else{
            throw new Error("Data ou horário inválido");
        } 
    }   
}

export default Consulta;