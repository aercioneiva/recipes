import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { db } from './base';


class Recipes extends Component {
  constructor() {
    super();
    this.state = {recipes:[]};

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    db.collection("recipes").get().then((querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc);
            //console.log(doc.id, " => ", doc.data());
        });

        this.setState({ recipes:list });
    });
  }

  handleClick(ev,ind,title){
    ev.preventDefault();
    const newfavorite = db.collection("favorites").doc();
    const recipe = db.collection("recipes").doc(ind);
    const data = {
      recipe : recipe,
      title: title
    };
    newfavorite.set(data).then(() => {});
    recipe.update({
      is_favorited :true
    });

    db.collection("recipes").get().then((querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
          list.push(doc);
          //console.log(doc.id, " => ", doc.data());
      });

      this.setState({ recipes:list });
    });
    alert('Receita foi adicionada no seu livro de receitas');
  }

  render() {
      const recipeList = this.state.recipes;
      const divStyle = {
        width: '16rem'
      };

    return (
      <div>
          {!recipeList.length && <h1>Nenhuma Receita Cadastrada</h1>}
          <div className="row">
           {
              recipeList.map((item, i) =>{
                  return (
                    
                    <div key={i} className="col-md-3">
                        <div className="card" style={divStyle}>
                                <img className="card-img-top" src="./foto.svg" />
                                <div className="card-body">
                                    <h5 className="card-title">{item.data().title}</h5>
                                    <p className="card-text">{item.data().description}</p>
                                    <NavLink to={"/R/"+item.id+"/edit"} className="btn btn-primary btn-sm">Ver receita</NavLink>
                                    {
                                      !item.data().is_favorited && <button type="submit" className="btn btn-primary btn-sm" onClick={e => this.handleClick(e,item.id,item.data().title)}>Favoritar Receita</button>
                                    }
                                    
                                    
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

export default Recipes;
