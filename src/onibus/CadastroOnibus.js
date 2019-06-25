import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import axios from 'axios';

export default class CadastroOnibus extends Component{

    constructor(){
        super();

        this.cadastrar = this.cadastrar.bind(this);
        this.editar = this.editar.bind(this);
        this.excluir = this.excluir.bind(this);
        this.carregarTabela = this.carregarTabela.bind(this);
        this.limparCampos = this.limparCampos.bind(this);        
        this.salvar = this.salvar.bind(this);        

        this.state = {         
            id: '',
            placa: '',
            modelo: '',
            marca: '',
            onibus: [],
            emEdicao: false,
            cadastradoComSucesso: false,
            excluidoComSucesso: false,
            salvoComSucesso: false
        }
    }

    componentDidMount = () => this.carregarTabela();

    async carregarTabela(){
        try {
            const response = await axios.get(`http://localhost:8080/api/onibus/`);
            this.setState({ onibus: response.data });
        }
        catch (error) {
            console.log(error);
        }
    }

    limparCampos(){
        this.setState({
            id: '',
            placa: '',
            modelo: '',
            marca: ''
        });
    }
    
    cadastrar(){
        const onibus = {
            placa: this.state.placa,
            modelo: this.state.modelo,
            marca: this.state.marca
        }

        axios.post(`http://localhost:8080/api/onibus/`, onibus)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({cadastradoComSucesso: true});
            setTimeout(() => this.setState({cadastradoComSucesso: false}), 3000)
        })        
        .catch(error => console.log(error)); 
    }

    editar(onibus){
        this.setState({
            emEdicao: true,
            id: onibus.id,
            placa: onibus.placa,
            modelo: onibus.modelo,
            marca: onibus.marca
        })
    }

    excluir(onibus){
        axios.delete(`http://localhost:8080/api/onibus/${onibus.id}`)
        .then(() => {
            this.carregarTabela();
            this.setState({excluidoComSucesso: true});
            setTimeout(() => this.setState({excluidoComSucesso: false}), 3000)
        })
        .catch(error => console.log(error));    
    }

    cancelar = () => {
        this.limparCampos();
        this.setState({emEdicao: false});
    }

    salvar(){
        const onibus = {
            placa: this.state.placa,
            modelo: this.state.modelo,
            marca: this.state.marca
        }

        axios.put(`http://localhost:8080/api/onibus/${this.state.id}`, onibus)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({salvoComSucesso: true});
            setTimeout(() => this.setState({salvoComSucesso: false}), 3000)
        })
        .catch(error => console.log(error))
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
                <h1>Cadastro de onibus</h1>
                {(this.state.cadastradoComSucesso) ? <Alert variant='success'>Cadastrado com sucesso!</Alert> : null}
                {(this.state.excluidoComSucesso) ? <Alert variant='success'>Excluido com sucesso!</Alert> : null}
                {(this.state.salvoComSucesso) ? <Alert variant='success'>Salvo com sucesso!</Alert> : null}
                <Form>
                    <Form.Group>
                        <Form.Label>Placa</Form.Label>
                        <Form.Control type="text" value={this.state.placa} onChange={event => this.setState({placa: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Modelo</Form.Label>
                        <Form.Control type="text" value={this.state.modelo} onChange={event => this.setState({modelo: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Marca</Form.Label>
                        <Form.Control type="text" value={this.state.marca} onChange={event => this.setState({marca: event.target.value})}/>
                    </Form.Group>

                    {(this.state.emEdicao) ? botoesEmEdicao : botoesCadastro}
                </Form>

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Placa</th>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.onibus.map(
                                bus => {
                                    return(
                                        <tr key={bus.id}>
                                            <td>{bus.id}</td>
                                            <td>{bus.placa}</td>
                                            <td>{bus.modelo}</td>
                                            <td>{bus.marca}</td>
                                            <td>
                                                <Button className="mr-2" variant="primary" onClick={() => this.editar(bus)}>Editar</Button>
                                                <Button variant="primary" onClick={() => this.excluir(bus)}>Excluir</Button>
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