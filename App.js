import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';



class App extends Component {
  
    state = {
        loading: false,
        query_brand: 0,
        query_model: "",
        brands: [],
        models: [],
        years: []
      
    
    };
 

    //Functions to handle state when some query is sent
    // Get all brands first
    getBrands = () => axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas')
                        .then(res => this.setState({ brands: res.data }))
                        .catch(err => console.log(err));

        
   getModels = async () => {
       if (this.state.query_brand !== 0) {
            this.setState({ loading: "Fetching models..." });
            let brand = Number(this.state.query_brand);
            let targetURL = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos/`;  
           await axios.get(`${targetURL}`)
                    .then(res => this.setState({ models: res.data }))
                    .catch(err => console.log(err));
        }};
   getYrs = async () => {
       if (this.state.query_model !== 0) {
            this.setState({ loading: "Fetching year" });
            let brand = Number(this.state.query_brand);
             let model = Number(this.state.query_model);
            let targetURL = `https://parallelum.com.br/fipe/api/v1/carros/marcas/59/$brand/modelos/${model}/anos`;
           await axios.get(`${targetURL}`)
                    .then(res => this.setState({ years: res.data }))
                    .catch(err => console.log(err));
        }};
  onChangeHandler = async (e) => {
    this.setState({ [e.target.name]: e.target.value, target: e.target.name });
      await 1000;
    this.state.target === 'query_brand' ? this.getModels() : ( this.state.target === "query_model" ? this.getYrs() : done() );
      
  };
   

 componentDidMount() {
     this.getBrands();
 }


  render() {
        const selectBrandOptions = this.state.brands.map(brand => (
    <option key={brand.codigo} value={brand.codigo}>
      {brand.nome}
    </option>
            ));
     const selectModelOptions = this.state.models.map(model => (
     <option key={model.codigo} value={model.codigo}>
          {model.nome}
    </option>    
            ));    
      
            
      
    return (
    <div className="App">
        <div className="col-3 p-4 d-inline-block">
        
            <select 
            value={this.state.query_brand} 
            onChange={this.onChangeHandler} 
            name="query_brand" 
            className="form-control"
             >
        {selectBrandOptions}
            </select>
        Selecione a marca:
        </div>
        <div className="col-3 p-4 d-inline-block">
            <select 
            value={this.state.query_model} 
            onChange={this.onChangeHandler}
            name="query_model"
            disabled={this.state.query_brand === 0}
            className="form-control"
            >
            <option value="placeholder">blablabla</option>
            <option value="hardcoption">blablabla</option>
            {selectModelOptions}
            </select>
            Selecione o modelo:
        </div>
          
        <div className="col-4 d-inline-block">
         //TODO
            <select key={this.state.brands} 
                value={this.state.query_year} 
                onChange={this.onChangeHandler}
                name="query_year"
                disabled={this.state.query_model === ""}
                className="form-control"
                >
             <option value="placeholder option">blablabla</option>
             <option value="placeholder option">blablabla</option>
            </select>
        </div>
    </div>
    );
  }
}

export default App;
