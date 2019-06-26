import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Motorista from './motorista/CadastroMotorista';
import Onibus from './onibus/CadastroOnibus';
import Viagem from './viagem/CadastroViagem';
import * as serviceWorker from './serviceWorker';
import {Router,Route,browserHistory} from 'react-router';


ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/viagens" component={Viagem}/>
            <Route path="/motoristas" component={Motorista}/>
            <Route path="/onibus" component={Onibus}/> 
        </Route>
    </Router>
    ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
