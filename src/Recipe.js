import React, { Component } from 'react';

import { db } from './base';

class Recipe extends Component{

    constructor(props) {
        super(props);
        this.state = {
            title:'',
            description:'',
            duration:0,
            ingredients:[],
            steps:[],
            is_favorited:false,
            yield:'',
            cover_url:'',
            step : '',
            ingrediente_quantity:0,
            ingrediente_unit:'',
            ingrediente_description:''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickStep = this.handleClickStep.bind(this);
        this.handleClickIngredient = this.handleClickIngredient.bind(this);
        this.handleClickPassoApagar = this.handleClickPassoApagar.bind(this);
        this.handleClickIngredientsApagar = this.handleClickIngredientsApagar.bind(this);
    }

    getInitialState = () => {
        return {
            title:'',
            description:'',
            duration:0,
            ingredients:[],
            steps:[],
            is_favorited:false,
            yield:'',
            cover_url:'',
            step : '',
            ingrediente_quantity:0,
            ingrediente_unit:'',
            ingrediente_description:''
        };
    }

    componentDidMount(){

        if(this.props.match.params.id){
            db.collection("recipes").doc(this.props.match.params.id).get().then((doc) => {
                this.setState({
                    title:doc.data().title,
                    description:doc.data().description,
                    duration:doc.data().duration,
                    ingredients:doc.data().ingredients,
                    steps:doc.data().steps,
                    is_favorited:doc.data().is_favorited,
                    yield:doc.data().yield,
                    cover_url:doc.data().cover_url
                });
            });
        }
    }

    handleSubmit(ev) {
        ev.preventDefault();
        const dados = {
            title:this.state.title,
            description:this.state.description,
            duration: parseInt(this.state.duration),
            ingredients:this.state.ingredients,
            steps:this.state.steps,
            is_favorited: this.state.is_favorited,
            yield:this.state.yield,
            cover_url:this.state.cover_url
        };

        if(!this.props.match.params.id){
            const newRecipe = db.collection("recipes").doc();
            const newfavorite = db.collection("favorites").doc();
            newRecipe.set(dados).then(() => {
                alert('receita cadastrada com sucesso!!!');
                this.refs.myForm.reset();
            
                //salva favorito
                if(dados.is_favorited){
                    const data = {
                        recipe : db.collection("recipes").doc(newRecipe.id),
                        title: dados.title
                    };
                    newfavorite.set(data).then(() => {});
                }
                this.setState(
                    this.getInitialState()
                );
                this.props.history.push('/Receitas')
            });
        }else{
            db.collection('recipes').doc(this.props.match.params.id).set(dados).then(() => {
                alert('receita atualizada com sucesso!!!');
                this.refs.myForm.reset();

                if(!dados.is_favorited){
                    db.collection("favorites").where('recipe','==',db.collection("recipes").doc(this.props.match.params.id)).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("favorites").doc(doc.id).delete().then(() =>{
                            });
                        });
                
        
                    });
                }
            
                this.setState(
                    this.getInitialState()
                );
                this.props.history.push('/Receitas')
            });
        }
        
        

        //console.log(dados);
        
    }
    handleChange(ev) {
        this.setState({...this.state,[ev.target.name]: ev.target.value});
    }

    handleClickStep(ev){
        ev.preventDefault();
        const step = this.state.step;
        this.setState({
            steps:[...this.state.steps,step]
        });
        this.setState({ step:''});
        this.refs.step.value = '';
    }

    handleClickIngredient(ev){
        ev.preventDefault();
        const {ingrediente_quantity,ingrediente_unit,ingrediente_description} = this.state;
        const ingredient = {
            quantity: parseInt(ingrediente_quantity),
            unit: ingrediente_unit,
            description: ingrediente_description
        };
        this.setState({
            ingrediente_quantity:0,
            ingrediente_unit:'',
            ingrediente_description:''
        });
        this.setState({
            ingredients:[...this.state.ingredients,ingredient]
        });
        this.refs.ingrediente_quantity.value = '';
        this.refs.ingrediente_unit.value = '';
        this.refs.ingrediente_description.value = '';
    }

    handleClickPassoApagar(ev,indice){
        ev.preventDefault();

        const newSteps = this.state.steps.filter((item,i) => {
            return indice !== i
        });

        this.setState({
            steps:[...newSteps]
        });

    }
    handleClickIngredientsApagar(ev,indice){
        ev.preventDefault();

        const newIngredients = this.state.ingredients.filter((item,i) => {
            return indice !== i
        });

        this.setState({
            ingredients:[...newIngredients]
        });

    }
    toggleChange = () => {
        this.setState({
            is_favorited: !this.state.is_favorited,
        });
      }
  render() {
    const {ingredients,steps} = this.state;

    const typeUnit = [];
    typeUnit['UN'] = 'Unidade';
    typeUnit['PC'] = 'Pedaço';
    typeUnit['KG'] = 'Kilo';

    return (
      <div>
        <h1>Aqui vai sua receita!</h1>
        <form onSubmit={this.handleSubmit} ref="myForm">
            <div className="form-row">
                <div className="form-group col-md-4">
                    <label>Nome</label>
                    <input type="text" className="form-control" id="title" name="title" onChange={this.handleChange} value={this.state.title}/>
                </div>
                <div className="form-group col-md-2 offset-md-4">
                    <label>Duração</label>
                    <input type="number" className="form-control" id="duration" name="duration" min="0" onChange={this.handleChange} value={this.state.duration}/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-4">
                    <label>Rende até..</label>
                    <input type="text" className="form-control" id="yield" name="yield" onChange={this.handleChange} value={this.state.yield}/>
                </div>
            </div>
            <p>Ingredientes</p>
            <hr/>
            <div className="form-row">
                <table className="table">
                    <thead>
                        <tr>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                        <th>Descrição</th>
                        <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ingredients.map((item,i) => {
                                return (
                                    <tr key={i}>
                                        <td>{item.quantity}</td>
                                        <td>{typeUnit[item.unit]}</td>
                                        <td>{item.description}</td>
                                        <td><a href="" onClick={e => this.handleClickIngredientsApagar(e,i)}>apagar</a></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="form-row">
                <div className="form-group col-md-2">
                    <label>Quantidade</label>
                    <input type="number" className="form-control" ref="ingrediente_quantity" name="ingrediente_quantity" min="0" onChange={this.handleChange}/>
                </div>
                <div className="form-group col-md-2">
                    <label>Unidade</label>
                    <select ref="ingrediente_unit" className="form-control" name="ingrediente_unit" onChange={this.handleChange}>
                        <option value="">(Selecione)</option>
                        <option value="UN">Unidade</option>
                        <option value="PC">Pedaço</option>
                        <option value="KG">Kilo</option>
                    </select>
                </div>
                <div className="form-group col-md-7">
                    <label>Descrição</label>
                    <input type="text" className="form-control" ref="ingrediente_description" name="ingrediente_description" onChange={this.handleChange}/>
                </div>
                <div className="form-group col-md-1 bb">
                    <button className="btn btn-primary" onClick={this.handleClickIngredient}>+</button>
                </div>
    
            </div>
            <p>Passo a passo</p>
            <hr/>
            <div className="form-row">
                <ul className="passo">
                    {steps.map((item,i) => {
                        return (
                            <li key={i}>{item} <a href="" onClick={e => this.handleClickPassoApagar(e,i)}>apagar</a></li> 
                        )
                    })}
                </ul> 
            </div>
            <div className="form-row">
                <div className="form-group col-md-4">
                    <input type="text" className="form-control" id="step" name="step" onChange={this.handleChange} ref="step"/>
                </div>
                <div className="form-group col-md-1">
                    <button className="btn btn-primary" onClick={this.handleClickStep}>+</button>
                </div>
            </div>
            <div className="form-row"> 
                <div className="form-group col-md-12">
                    <label>Descrição</label>
                    <textarea className="form-control" id="description" rows="3" name="description" onChange={this.handleChange} value={this.state.description}></textarea>
                </div>
            </div>
            <div className="form-row form-check">
                <input className="form-check-input" type="checkbox" name="is_favorited" id="is_favorited" onChange={this.toggleChange} checked={this.state.is_favorited}/>
                <label className="form-check-label">
                    Receita Favorita?
                </label>
            </div>
            <div className="form-row mg">
            {
                this.props.match.params.id && <button type="submit" className="btn btn-primary">Atualizar</button>

            }
            {
                !this.props.match.params.id && <button type="submit" className="btn btn-primary">Cadastrar</button>

            }
                
            </div>
        </form>
      </div>
    );
  }
}
export default Recipe;
