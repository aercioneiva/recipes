import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { db } from './base';


class Favorites extends Component {
  constructor() {
    super();
    this.state = {recipes:[]};
  }

  componentDidMount(){
    db.collection("favorites").get().then((querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc);
        });

        this.setState({ recipes:list });
    });
  }

  render() {
    const recipeList = this.state.recipes;
    const divStyle = {
      width: '16rem'
    };

  return (
    <div>
        <h1>Meu livro de receitas</h1>
        <div className="row">
           {
              recipeList.map((item, i) =>{
                  return (
                    
                    <div key={i} className="col-md-3">
                        <div className="card" style={divStyle}>
                                <img className="card-img-top" src="./foto.svg" />
                                <div className="card-body">
                                    <h5 className="card-title">{item.data().title}</h5>
                                    <NavLink to={"/R/"+item.data().recipe.id+"/edit"} className="btn btn-primary">Ver receita</NavLink>
                                </div>
                        </div>
                    </div>
               
                  )
              })
          }
        </div>
    </div>
  );
  }
}

export default Favorites;
