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
            salvoComSucesso: false,
            alert: {
                isVisible: false,
                variant: '',
                message: ''
            },
            erros: []
        }
    }

    componentDidMount = () => this.carregarTabela();

    async carregarTabela(){
        try {
            const response = await axios.get(`http://localhost:8080/api/onibus/`);
            this.setState({ onibus: response.data });
        }
        catch (error) {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao carregar os ônibus! ${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error);
        }
    }

    limparCampos(){
        this.setState({
            id: '',
            placa: '',
            modelo: '',
            marca: '',
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
    
    cancelar = () => {
        this.limparCampos();
        this.setState({emEdicao: false});
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
    
    ehOnibusValido(onibus){
        const erros = [];

        if(!onibus.placa)
            erros.push('O campo placa é obrigatório');
        if(!onibus.modelo)
            erros.push('O campo modelo é obrigatório');
        if(!onibus.marca)
            erros.push('O campo marca é obrigatório');
            
        return erros;
    }


    async cadastrar(){
        const onibus = {
            placa: this.state.placa,
            modelo: this.state.modelo,
            marca: this.state.marca
        }

        const erros = await this.ehOnibusValido(onibus);

        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.post(`http://localhost:8080/api/onibus/`, onibus)
        .then(() => {
            this.carregarTabela();
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

    excluir(onibus){
        axios.delete(`http://localhost:8080/api/onibus/${onibus.id}`)
        .then(() => {
            this.carregarTabela();
            this.setState({alert: {isVisible: true, variant: 'success', message: 'Excluído com sucesso!'}});
            setTimeout(() => this.limparAlert(), 3000)
        })
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao excluir! ${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
            console.log(error)
        });
    }

    async salvar(){
        const onibus = {
            placa: this.state.placa,
            modelo: this.state.modelo,
            marca: this.state.marca
        }

        const erros = await this.ehOnibusValido(onibus);
        if(erros.length > 0){
            this.setState({erros: erros});
            return;
        }

        axios.put(`http://localhost:8080/api/onibus/${this.state.id}`, onibus)
        .then(() => {
            this.carregarTabela();
            this.limparCampos();
            this.setState({alert: {isVisible: true, variant: 'success', message: 'Salvo com sucesso!'}});
            setTimeout(() => this.limparAlert(), 3000)
        })
        .catch(error => {
            this.setState({alert: {isVisible: true, variant: 'danger', message: `Erro ao excluir! ${error.message}`}});
            setTimeout(() => this.limparAlert(), 3000)
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
                <h1>Cadastro de onibus</h1>
                {(this.state.alert.isVisible) ? <Alert variant={this.state.alert.variant}>{this.state.alert.message}</Alert> : null}
                {this.state.erros.map( erro => <Alert variant='danger'>{erro}</Alert>)}
                <Form>
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control readOnly type="text" value={this.state.id} onChange={event => this.setState({id: event.target.value})}/>
                    </Form.Group>

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

                <Form>
                    <Form.Group>
                        <Form.Label>Pesquisa</Form.Label>
                        <Form.Control placeholder="Placa, modelo, marca..." type="text" value={this.state.filtro} onChange={event => this.setState({filtro: event.target.value}).then(() => this.filtrar())}/>
                    </Form.Group>
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