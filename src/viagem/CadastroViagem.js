import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import DayPicker from 'react-day-picker';
import axios from 'axios';
import './viagem.css';
import { isUndefined } from 'util';

export default class CadastroViagem extends Component{

    constructor(){
        super();

        this.cadastrar = this.cadastrar.bind(this);
        this.setMotorista = this.setMotorista.bind(this);
        this.setOnibus = this.setOnibus.bind(this);
        this.editar = this.editar.bind(this);
        this.salvar = this.salvar.bind(this);
        this.filtrar = this.filtrar.bind(this);
        this.setData = this.setData.bind(this);
        this.ehViagemValida = this.ehViagemValida.bind(this);
        
        this.state = {
            id: '',
            origem: '',
            destino: '',
            data: '',
            horaSaida: '',
            horaChegada: '',
            lstmotoristas: [],
            lstonibus: [],
            motorista: undefined,
            onibus: undefined,
            usuario: {},
            lstViagens: [],
            emEdicao: false,
            erros: [],
            alert: {
                isVisible: false,
                variant: '',
                message: ''
            }
        }
    }
    
    componentDidMount(){
        this.carregarMotoristas();
        this.carregarOnibus();
        this.carregarViagens();
    }
    
    setOnibus = event => this.setState({onibus: this.state.lstonibus.filter(o => event.target.value == o.id)[0]});
    setMotorista = event => this.setState({motorista: this.state.lstmotoristas.filter(m => event.target.value == m.id)[0]});

    limparAlert(){
        this.setState({
            alert: {
                isVisible: false, 
                variant: '', 
                message: ''
            }
        });
    }
    
    cancelar = () => {
        this.limparCampos();
        this.setState({emEdicao: false});
    }
    
    limparCampos(){
        const motoristas = this.state.lstmotoristas.map(
            motorista => {
                if(motorista.id === 0)
                    motorista.isSelected = true; 
                else
                    motorista.isSelected = false; 

                return motorista;
            }
        )

        const onibus = this.state.lstonibus.map(
            bus => {
                if(bus.id === 0)
                    bus.isSelected = true;                
                else
                    bus.isSelected = false;

                return bus;
            }
        )
        
        this.setState({
            id: '',
            origem: '',
            destino: '',
            data: '',
            horaSaida: '',
            horaChegada: '',
            lstmotoristas: motoristas,
            lstonibus: onibus,
            erros: [],
            motorista: undefined,
            onibus: undefined
        });
    }
    
    async editar(viagem){
        const motoristas = this.state.lstmotoristas.map(
            motorista => {
                if(motorista.id === viagem.motorista.id)
                    motorista.isSelected = true;                
                return motorista;
            }
        )

        const onibus = this.state.lstonibus.map(
            bus => {
                if(bus.id === viagem.onibus.id)
                    bus.isSelected = true;                
                return bus;
            }
        )

        this.setState({
            emEdicao: true,
            id: viagem.id,
            origem: viagem.origem,
            destino: viagem.destino,
            data: viagem.data,
            horaSaida: viagem.horaSaida,
            horaChegada: viagem.horaChegada,
            motorista: viagem.motorista,
            onibus: viagem.onibus,
            lstmotoristas: motoristas,
            lstonibus: onibus
        })
    }
    
    async carregarMotoristas(){
        try {
            const response = await axios.get(`http://localhost:8080/api/motoristas/`);
            const motoristas = response.data;
            motoristas.unshift({id:'0',nome: 'Selecione'});
            this.setState({ lstmotoristas: motoristas});
        }
        catch (error) {
            console.log(error);
        }
    }

    async carregarOnibus(){
        try {
            const response = await axios.get(`http://localhost:8080/api/onibus/`);
            const onibus = response.data;
            onibus.unshift({id:'0', placa: '', modelo: 'Selecione'});
            this.setState({ lstonibus:  onibus});
        }
        catch (error){
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao carregar as viagens! ${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        }; 
    }

    async carregarViagens(){
        try {
            const response = await axios.get(`http://localhost:8080/api/viagens/`);
            this.setState({ lstViagens: response.data });
        }
        catch (error) {
            console.log(error);
        }
    }

    ehViagemValida(viagem){
        const erros = [];
        if(!viagem.origem)
            erros.push('O campo origem é obrigatório');
        if(!viagem.destino)
            erros.push('O campo destino é obrigatório');
        if(!viagem.data)
            erros.push('O campo data é obrigatório');
        if(!viagem.horaSaida)
            erros.push('O campo horário de partida é obrigatório');
        if(!viagem.horaChegada)
            erros.push('O campo horário de chegada é obrigatório');
        if(isUndefined(viagem.motorista))
            erros.push('O campo motorista é obrigatório');
        if(isUndefined(viagem.onibus))
            erros.push('O campo ônibus é obrigatório');
        
        return erros;
    }

    async cadastrar(event){
        event.preventDefault();

        const viagem = {
            origem: this.state.origem,
            destino: this.state.destino,
            data: this.state.data,
            horaSaida: this.state.horaSaida,
            horaChegada: this.state.horaChegada,
            motorista: this.state.motorista,
            onibus: this.state.onibus,
            usuario: {}
        }

        const erros = await this.ehViagemValida(viagem);

        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.post(`http://localhost:8080/api/viagens/`, viagem)
        .then(() => {
            this.carregarViagens();
            this.limparCampos();
            this.setState({alert: {isVisible: true, variant: 'success', message: 'Cadastrado com sucesso!'}});
            setTimeout(() => this.limparAlert(), 3000)
        })        
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao cadastrar!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });

    }

    async salvar(){
        const viagem = {
            origem: this.state.origem,
            destino: this.state.destino,
            data: this.state.data,
            horaSaida: this.state.horaSaida,
            horaChegada: this.state.horaChegada,
            motorista: this.state.motorista,
            onibus: this.state.onibus,
            usuario: {}
        }

        const erros = await this.ehViagemValida(viagem);
        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.put(`http://localhost:8080/api/viagens/${this.state.id}`, viagem)
        .then(() => {
            this.carregarViagens();
            this.limparCampos();
            this.setState({alert: {isVisible: true, variant: 'success', message: 'Salvo com sucesso!'}});
            setTimeout(() => this.limparAlert(), 3000)
        })
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao salvar!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });
    }

    excluir(viagem){
        axios.delete(`http://localhost:8080/api/viagens/${viagem.id}`)
        .then(() => {
            this.carregarViagens();
            this.setState({alert: {isVisible: true, variant: 'success', message: `Excluído com sucesso!`}});
            setTimeout(() => this.limparAlert(), 3000)
        })
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao excluir!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });    
    }

    async filtrar(pFiltro){
        await this.setState({filtro: pFiltro});
        
        if(this.state.filtro === ''){
            this.carregarViagens();
            return;
        }

        console.log(this.state.filtro);
        this.setState({lstViagens: this.state.lstViagens.filter(
            viagem => {
                return viagem.origem.includes(this.state.filtro)
                || viagem.destino.includes(this.state.filtro)
                || viagem.data.includes(this.state.filtro)
                || viagem.horaSaida.includes(this.state.filtro)
                || viagem.horaChegada.includes(this.state.filtro)
                || viagem.motorista.nome.includes(this.state.filtro)
                || viagem.onibus.placa.includes(this.state.filtro)
            })
        });
    }

    async setData(date){
        const dataNormal = await date.split('/');
        this.setState({data: `${dataNormal[1]}/${dataNormal[0]}/${dataNormal[2]}`});
    }
    
    render(){
        const botoesEmEdicao = (
            <div>
                <Button className="mr-2 mb-2" variant="primary" onClick={this.salvar}>Salvar</Button>
                <Button className="mr-2 mb-2" variant="primary" onClick={this.cancelar}>Cancelar</Button>
            </div>
        );

        const botoesCadastro = (
            <div>
                <Button className="mr-2 mb-2" variant="primary" type="submit" onClick={this.cadastrar}>Cadastrar</Button>
                <Button className="mr-2 mb-2" variant="primary" onClick={this.cancelar}>Cancelar</Button>
            </div>
        );

        return(
            <Container>
                <h1>Cadastro de viagem</h1>
                {(this.state.alert.isVisible) ? <Alert variant={this.state.alert.variant}>{this.state.alert.message}</Alert> : null}
                {this.state.erros.map( erro => <Alert variant='danger'>{erro}</Alert>)}
                <Form>
                    <Form.Group className="d-flex">
                        <Form.Label className="m-1">ID</Form.Label>
                        <Form.Control readOnly type="text" value={this.state.id} onChange={event => this.setState({id: event.target.value})}/>
                    </Form.Group>

                    <Form.Group className="d-flex">
                        <Form.Label className="m-1">Origem</Form.Label>
                        <Form.Control required type="text" value={this.state.origem} onChange={event => this.setState({origem: event.target.value})}/>
                    </Form.Group>

                    <Form.Group className="d-flex">
                        <Form.Label className="m-1">Destino</Form.Label>
                        <Form.Control type="text" value={this.state.destino} onChange={event => this.setState({destino: event.target.value})} required/>
                    </Form.Group>

                    <div className="d-inline-flex p-0">
                        <div className="p-0 m-0">
                            <DayPicker onDayClick={date => this.setData(date.toLocaleDateString())}/>
                        </div>
                        
                        <div className="p-0 m-3">
                            <Form.Label>Data</Form.Label>
                            <Form.Control readOnly type="text" value={this.state.data}/>
                            
                            <Form.Label>Horário de partida</Form.Label>
                            <Form.Control type="time" value={this.state.horaSaida} onChange={event => this.setState({horaSaida: event.target.value})}/>
                        
                            <Form.Label>Horário de chegada</Form.Label>
                            <Form.Control type="time" value={this.state.horaChegada} onChange={event => this.setState({horaChegada: event.target.value})}/>
                        </div>
                    </div>
                    <Form.Group className="d-flex">
                        <Form.Label className="m-1">Motorista</Form.Label>
                        <Form.Control as="select" onChange={this.setMotorista}>
                            {
                                this.state.lstmotoristas.map(
                                    motorista => {
                                        return(
                                            <option key={motorista.id} value={motorista.id} selected={motorista.isSelected}>
                                                {motorista.nome}
                                            </option>
                                        );
                                    }
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="d-flex">
                        <Form.Label className="m-1">Onibus</Form.Label>
                        <Form.Control as="select" onChange={this.setOnibus}>
                            {
                                this.state.lstonibus.map(
                                    bus => {
                                        return(
                                            <option key={bus.id} value={bus.id} selected={bus.isSelected}>
                                                {bus.modelo}
                                            </option>
                                        );
                                    }
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    {(this.state.emEdicao) ? botoesEmEdicao : botoesCadastro}
                </Form>

                <Form.Group className="d-flex">
                    <Form.Label className="m-1">Pesquisa</Form.Label>
                    <Form.Control placeholder="Origem, destino, data..." type="text" value={this.state.filtro} onChange={event => this.filtrar(event.target.value)}/>
                </Form.Group>

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origem</th>
                            <th>Destino</th>
                            <th>Data</th>
                            <th>Hr partida</th>
                            <th>Hr chegada</th>
                            <th>Motorista</th>
                            <th>Ônibus</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.lstViagens.map(
                                viagem => {
                                    return(
                                        <tr key={viagem.id}>
                                            <td>{viagem.id}</td>
                                            <td>{viagem.origem}</td>
                                            <td>{viagem.destino}</td>
                                            <td>{viagem.data}</td>
                                            <td>{viagem.horaSaida}</td>
                                            <td>{viagem.horaChegada}</td>
                                            <td>{viagem.motorista.nome}</td>
                                            <td>{`${viagem.onibus.placa} - ${viagem.onibus.modelo}`}</td>
                                            <td>
                                                <Button className="m-1 col-12" variant="primary" onClick={() => this.editar(viagem)}>Editar</Button>
                                                <Button className="m-1 col-12" variant="primary" onClick={() => this.excluir(viagem)}>Excluir</Button>
                                            </td>  
                                        </tr>
                                    );
                                }
                            )
                        }
                    </tbody>
                </Table>
            </Container>
        );
    }
}