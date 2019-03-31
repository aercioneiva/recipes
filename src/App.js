import React, { Component } from 'react';
import {BrowserRouter, Route,Switch, NavLink} from 'react-router-dom';

import Recipes from './Recipes';
import Recipe from './Recipe';
import Favorites from './Favorites';



const Home = () => {
    return (
        <div>
            <h1>Aplicação de Receitas</h1>
        </div>
    )
}


class App extends Component {
  
  componentDidMount(){
   

  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="">
            <NavLink to='/'>Home</NavLink>
            
            </a>
            <NavLink to='/Receitas' className="nav-link">Receitas</NavLink>
            <NavLink to='/Receita' className="nav-link">Cadastrar Nova Receita</NavLink>
            <NavLink to='/Favoritas' className="nav-link">Livro de Receitas</NavLink>
          </nav>
          <div className="container">
            <Switch>
              <Route path="/" component={Home}  exact />
              <Route path="/Receitas" component={Recipes} />
              <Route path="/Receita" component={Recipe} />
              <Route 
                path="/R/:id/edit" 
                component={Recipe}
              />
              <Route path="/Favoritas" component={Favorites} />
            </Switch>
          </div>
          
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
