import React, { Component } from "react";
import "ReactDOM" from 'react-dom';
import axios from "axios";

class App extends Component {
  state = {
    loading: false,
    queryBrand: 0,
    queryModel: "",
    queryYear: "",
    filled: false,
    fetchedBrands: [],
    fetchedModels: [],
    fetchedYears: []
  };

  //Functions to handle state when some query is sent
  // Get all brands first
  getBrands = () =>
    axios
      .get("https://parallelum.com.br/fipe/api/v1/carros/marcas")
      .then(res => this.setState({ fetchedBrands: res.data }))
      .catch(err => console.log(err));
  // Display options after state is changed

  getModels = async () => {
    if (this.state.queryBrand !== 0) {
      this.setState({ loading: "Fetching models..." });
      let brand = this.state.queryBrand;
      let targetURL =
        "https://parallelum.com.br/fipe/api/v1/carros/marcas/" +
        brand +
        "/modelos";
      console.log(targetURL);
      await axios
        .get(`${targetURL}`)
        .then(res =>
          this.setState({ fetchedModels: res.data.modelos, loading: false })
        )
        .catch(err => console.log(err));
    }
  };
  getYrs = async () => {
    if (this.state.queryModel !== 0) {
      this.setState({ loading: "Fetching year" });
      let brand = this.state.queryBrand;
      let model = this.state.queryModel;
      let targetURL =
        "https://parallelum.com.br/fipe/api/v1/carros/marcas/" +
        brand +
        "/modelos/" +
        model +
        "/anos";
      console.log(targetURL);
      await axios
        .get(`${targetURL}`)
        .then(res =>
          this.setState({
            fetchedYears: res.data,
            filled: true,
            loading: false
          })
        )
        .catch(err => console.log(err));
    }
  };
  onChangeHandler = async e => {
    this.setState({
      [e.target.name]: e.target.value,
      target: e.target.name
    });
    await 800;
    this.state.target === "queryBrand"
      ? this.getModels()
      : this.state.target === "queryModel"
      ? this.getYrs()
      : this.setState({ errors: "Target isn't handled!" });
  };

  componentDidMount() {
    this.getBrands();
  }

  render() {
    const { fetchedModels, fetchedYears } = this.state;

    const selectBrandOptions = this.state.fetchedBrands.map(brand => (
      <option key={brand.codigo} value={brand.codigo}>
        {brand.nome}
      </option>
    ));

    return (
      <div className="App">
        <div className="col-3 p-4 d-inline-block">
          <select
            value={this.state.queryBrand}
            onChange={this.onChangeHandler}
            name="queryBrand"
            className="form-control"
          >
            {selectBrandOptions}
          </select>
          Selecione a marca:
        </div>
        <div className="col-3 p-4 d-inline-block">
          <select
            value={this.state.queryModel}
            onChange={this.onChangeHandler}
            name="queryModel"
            disabled={this.state.queryBrand === 0}
            className="form-control"
          >
            {fetchedModels.map(item => (
              <option key={item.codigo} value={item.codigo}>
                {item.nome}
              </option>
            ))}
          </select>
          Selecione o modelo:
        </div>

        <div className="col-4 d-inline-block">
          <select
            value={this.state.queryYear}
            onChange={this.onChangeHandler}
            name="year"
            disabled={this.state.queryModel === ""}
            className="form-control"
          >
            {fetchedYears.map(item => (
              <option key={item.codigo} value={item.codigo}>
                {item.nome}
              </option>
            ))}
          </select>
          Selecione o ano: ~TO DO~
        </div>
      </div>
    );
  }
}

export default App;
