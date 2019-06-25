import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import axios from 'axios';

export default class CadastroMotorista extends Component{
    
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
            nome: '',
            cnh: '',
            motoristas: [],
            emEdicao: false,
            cadastradoComSucesso: false,
            excluidoComSucesso: false,
            salvoComSucesso: false
        }
    }

    componentDidMount = () => this.carregarTabela();

    async carregarTabela(){
        try {
            const response = await axios.get(`http://localhost:8080/api/motoristas/`);
            this.setState({ motoristas: response.data });
        }
        catch (error) {
            console.log(error);
        }
    }

    limparCampos(){
        this.setState({
            id: '',
            nome: '',
            cnh: ''
        });
    }

    cadastrar(){
        const motorista = {
            nome: this.state.nome,
            cnh: this.state.cnh
        }

        axios.post(`http://localhost:8080/api/motoristas/`, motorista)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({cadastradoComSucesso: true});
            setTimeout(() => this.setState({cadastradoComSucesso: false}), 3000)
        })        
        .catch(error => console.log(error));        
    }

    editar(motorista){
        this.setState({
            emEdicao: true,
            id: motorista.id,
            nome: motorista.nome,
            cnh: motorista.cnh
        })
    }

    excluir(motorista){
        axios.delete(`http://localhost:8080/api/motoristas/${motorista.id}`)
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
        const motorista = {
            nome: this.state.nome,
            cnh: this.state.cnh
        }

        axios.put(`http://localhost:8080/api/motoristas/${this.state.id}`, motorista)
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
                <h1>Cadastro de Motorista</h1>
                {(this.state.cadastradoComSucesso) ? <Alert variant='success'>Cadastrado com sucesso!</Alert> : null}
                {(this.state.excluidoComSucesso) ? <Alert variant='success'>Excluido com sucesso!</Alert> : null}
                {(this.state.salvoComSucesso) ? <Alert variant='success'>Salvo com sucesso!</Alert> : null}
                <Form>
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control readOnly type="text" value={this.state.id} onChange={event => this.setState({id: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control required type="text" value={this.state.nome} onChange={event => this.setState({nome: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>CNH</Form.Label>
                        <Form.Control type="text" value={this.state.cnh} onChange={event => this.setState({cnh: event.target.value})}/>
                    </Form.Group>

                    {(this.state.emEdicao) ? botoesEmEdicao : botoesCadastro}
                </Form>

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CNH</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.motoristas.map(
                                motorista => {
                                    return(
                                        <tr key={motorista.id}>
                                            <td>{motorista.id}</td>
                                            <td>{motorista.nome}</td>
                                            <td>{motorista.cnh}</td>
                                            <td>
                                                <Button className="mr-2" variant="primary" onClick={() => this.editar(motorista)}>Editar</Button>
                                                <Button variant="primary" onClick={() => this.excluir(motorista)}>Excluir</Button>
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