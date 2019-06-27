import React,{Component} from 'react';
import {Link} from 'react-router';
import './css/pure-min.css';
import'./css/side-menu.css';

class App extends Component{

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>

        <div id="menu">
          <div className="pure-menu">
              <a className="pure-menu-heading" href="/">Rodoviária</a>

              <ul className="pure-menu-list">
                  <li className="pure-menu-item">
                    <Link to="/viagens" className="pure-menu-link">Viagens</Link>
                  </li>
                  <li className="pure-menu-item">
                    <Link to="/motoristas" className="pure-menu-link">Motoristas</Link>
                  </li>
                  <li className="pure-menu-item">
                    <Link to="/onibus" className="pure-menu-link">Ônibus</Link>
                  </li>
              </ul>
          </div>
        </div>

        <div className="content">
          {this.props.children}
        </div> 

      </div>
    );
  }
}
export default App;
