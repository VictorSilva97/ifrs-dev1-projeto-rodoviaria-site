import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { EventEmitter } from 'events';

export default class CadastroMotorista extends Component{
    
    constructor(){
        super();

        this.cadastrar = this.cadastrar.bind(this);
        this.editar = this.editar.bind(this);
        this.excluir = this.excluir.bind(this);
        this.carregarTabela = this.carregarTabela.bind(this);
        this.limparCampos = this.limparCampos.bind(this);        
        this.limparAlert = this.limparAlert.bind(this);        
        this.salvar = this.salvar.bind(this);        
        this.filtrar = this.filtrar.bind(this);        

        this.state = {
            id: '',
            nome: '',
            cnh: '',
            motoristas: [],
            emEdicao: false,
            alert: {
                isVisible: false,
                variant: '',
                message: ''
            },
            filtro: '',
            erros: []
        }
    }

    componentDidMount = () => this.carregarTabela();

    async carregarTabela(){
        try {
            const response = await axios.get(`http://localhost:8080/api/motoristas/`);
            this.setState({ motoristas: response.data });
        }
        catch (error) {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao carregar os motoristas! ${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error);
        }
    }

    limparCampos(){
        this.setState({
            id: '',
            nome: '',
            cnh: '',
            erros: []
        });
    }

    limparAlert(){
        this.setState({
            alert: {
                isVisible: false, 
                variant: '', 
                message: ''
            }
        });
    }

    ehMotoristaValido(motorista){
        const erros = [];

        if(!motorista.nome)
            erros.push('O campo nome é obrigatório');
        if(!motorista.cnh)
            erros.push('O campo cnh é obrigatório');
        if(motorista.cnh.length != 11)
            erros.push('A cnh deve ter 11 caracteres');

        return erros;
    }

    async cadastrar(){
        const motorista = {
            nome: this.state.nome,
            cnh: this.state.cnh
        }

        const erros = await this.ehMotoristaValido(motorista);

        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.post(`http://localhost:8080/api/motoristas/`, motorista)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({alert: {isVisible: true, variant: 'success', message: 'Cadastrado com sucesso!'}});
            setTimeout(() => this.limparAlert(), 3000)
        })        
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao cadastrar!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000);
        });        
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
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao excluir!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });        
    }

    cancelar = () => {
        this.limparCampos();
        this.setState({emEdicao: false});
    }

    async salvar(){
        const motorista = {
            nome: this.state.nome,
            cnh: this.state.cnh
        }

        const erros = await this.ehMotoristaValido(motorista);

        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.put(`http://localhost:8080/api/motoristas/${this.state.id}`, motorista)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({salvoComSucesso: true});
            setTimeout(() => this.setState({salvoComSucesso: false}), 3000)
        })
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao salvar!${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });        
    }

    async filtrar(pFiltro){
        await this.setState({filtro: pFiltro});
        
        if(this.state.filtro === ''){
            this.carregarTabela();
            return;
        }

        this.setState({motoristas: this.state.motoristas.filter(
            motorista => {
                return motorista.nome.includes(this.state.filtro)
                || motorista.cnh.includes(this.state.filtro)
            })
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
                <h1>Cadastro de motorista</h1>
                {(this.state.alert.isVisible) ? <Alert variant={this.state.alert.variant}>{this.state.alert.message}</Alert> : null}
                {this.state.erros.map( erro => <Alert variant='danger'>{erro}</Alert>)}
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

                <Form>
                    <Form.Group>
                        <Form.Label>Pesquisa</Form.Label>
                        <Form.Control placeholder="Nome, CNH..." type="text" value={this.state.filtro} onChange={event => this.filtrar(event.target.value)}/>
                    </Form.Group>
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