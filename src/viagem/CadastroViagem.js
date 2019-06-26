import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import axios from 'axios';

export default class CadastroViagem extends Component{

    constructor(){
        super();

        this.cadastrar = this.cadastrar.bind(this);
        this.setMotorista = this.setMotorista.bind(this);
        this.setOnibus = this.setOnibus.bind(this);
        this.editar = this.editar.bind(this);
        this.salvar = this.salvar.bind(this);

        this.state = {
            id: '',
            origem: '',
            destino: '',
            data: '',
            horaSaida: '',
            horaChegada: '',
            lstmotoristas: [],
            lstonibus: [],
            motorista: {},
            onibus: {},
            usuario: {},
            lstViagens: [],
            emEdicao: false,
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
        this.setState({
            id: '',
            origem: '',
            destino: '',
            data: '',
            horaSaida: '',
            horaChegada: ''
        });
    }
    
    editar(viagem){
        this.setState({
            emEdicao: true,
            id: viagem.id,
            origem: viagem.origem,
            destino: viagem.destino,
            data: viagem.data,
            horaSaida: viagem.horaSaida,
            horaChegada: viagem.horaChegada
        })
    }
    
    async carregarMotoristas(){
        try {
            const response = await axios.get(`http://localhost:8080/api/motoristas/`);
            this.setState({ lstmotoristas: response.data });
        }
        catch (error) {
            console.log(error);
        }
    }

    async carregarOnibus(){
        try {
            const response = await axios.get(`http://localhost:8080/api/onibus/`);
            this.setState({ lstonibus: response.data });
        }
        catch (error) {
            console.log(error);
        }
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

    cadastrar(){
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

    salvar(){
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
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao cadastrar!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });    
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
                <Button className="mr-2 mb-2" variant="primary" onClick={this.cadastrar}>Cadastrar</Button>
                <Button className="mr-2 mb-2" variant="primary" onClick={this.cancelar}>Cancelar</Button>
            </div>
        );

        return(
            <Container>
                <h1>Cadastro de viagem</h1>
                {(this.state.alert.isVisible) ? <Alert variant={this.state.alert.variant}>{this.state.alert.message}</Alert> : null}
                <Form>
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control readOnly type="text" value={this.state.id} onChange={event => this.setState({id: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Origem</Form.Label>
                        <Form.Control type="text" value={this.state.origem} onChange={event => this.setState({origem: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Destino</Form.Label>
                        <Form.Control type="text" value={this.state.destino} onChange={event => this.setState({destino: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control type="text" value={this.state.data} onChange={event => this.setState({data: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Horário de partida</Form.Label>
                        <Form.Control type="text" value={this.state.horaSaida} onChange={event => this.setState({horaSaida: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Horário de chegada</Form.Label>
                        <Form.Control type="text" value={this.state.horaChegada} onChange={event => this.setState({horaChegada: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Motorista</Form.Label>
                        <Form.Control as="select" onChange={this.setMotorista}>
                            <option>Selecione</option>
                            {
                                this.state.lstmotoristas.map(
                                    motorista => {
                                        return(
                                            <option key={motorista.id} value={motorista.id}>
                                                {`${motorista.id} - ${motorista.nome}`}
                                            </option>
                                        );
                                    }
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Onibus</Form.Label>
                        <Form.Control as="select" onChange={this.setOnibus}>
                            <option>Selecione</option>
                            {
                                this.state.lstonibus.map(
                                    bus => {
                                        return(
                                            <option key={bus.id} value={bus.id}>
                                                {`${bus.placa} - ${bus.modelo}`}
                                            </option>
                                        );
                                    }
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    {(this.state.emEdicao) ? botoesEmEdicao : botoesCadastro}
                </Form>


                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origem</th>
                            <th>Destino</th>
                            <th>Data</th>
                            <th>Hr partida</th>
                            <th>Hr chegada</th>
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
                                            <td>
                                                <Button className="mr-2" variant="primary" onClick={() => this.editar(viagem)}>Editar</Button>
                                                <Button variant="primary" onClick={() => this.excluir(viagem)}>Excluir</Button>
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