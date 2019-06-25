import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';

const motoristas = ['Motorista 1','Motorista 2','Motorista 3'];
const onibus = ['Onibus 1','Onibus 2','Onibus 3',];

export default class CadastroViagem extends Component{

    constructor(){
        super();

        this.cadastrar = this.cadastrar.bind(this);

        this.state = {
            origem: '',
            destino: '',
            data: '',
            horaSaida: '',
            horaChegada: '',
            motoristas: [],
            onibus: []
        }
    }

    componentDidMount(){
        this.setState({
            motoristas: motoristas,
            onibus: onibus
        });
    }

    cadastrar(){
        const viagem = {
        }

        axios.post(`http://localhost:8080/api/viagens/`, viagem)
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

    render(){
        return(
            <Container>
                <h1>Cadastro de viagem</h1>
                <Form>
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
                        <Form.Control as="select">
                        <option>Selecione</option>
                        {
                            this.state.motoristas.map(
                                motorista => {
                                    return(
                                        <option>{motorista}</option>
                                    );
                                }
                            )
                        }
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Onibus</Form.Label>
                        <Form.Control as="select">
                            <option>Selecione</option>
                            {
                                this.state.onibus.map(
                                    bus => {
                                        return(
                                            <option>{bus}</option>
                                        );
                                    }
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" onClick={this.cadastrar}>Salvar</Button>
                </Form>
            </Container>
        );
    }
}