import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default class Login extends Component{

    constructor(){
        super();

        this.state = {
            usuario: '',
            senha: ''
        }
    }

    render(){
        return(
            <Container>
                <h1>Login</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control type="text" value={this.state.usuario} onChange={event => this.setState({nome: event.target.value})}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" value={this.state.senha} onChange={event => this.setState({senha: event.target.value})}/>
                    </Form.Group>

                    <Button variant="primary">Logar</Button>
                </Form>
            </Container>
        );
    }
}