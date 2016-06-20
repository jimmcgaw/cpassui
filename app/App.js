import React, { Component } from 'react';

const jQuery = require('jquery');
const shelljs = require('shelljs');

import Results from './components/Results';
import SearchForm from './components/SearchForm';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchValue: '',
      clipboardMessage: '',
      results: []
    };

    this.onChangeTagValue = this.onChangeTagValue.bind(this);
    this.executeSearch = this.executeSearch.bind(this);
  }

  onChangeTagValue(e){
    this.setState({
      'searchValue': e.target.value
    });
  }

  executeSearch(e){
    e.preventDefault();

    let command = 'cpass ' + this.state.searchValue;
    shelljs.exec(command, (code, stdout) => {
      let value = stdout;
      let passwordEntries = stdout.split('\n\n');

      let firstPassword = passwordEntries[0].split(' ')[0];

      let results = [];
      let clipboardMessage = '';
      let passwordResults = stdout.split("\n\n");

      passwordResults.forEach(function(result){
        results.push(result);
      });

      if (results.length > 0){
        let clipboardMessage = "Added first result `" + firstPassword + "` to clipboard";
      }

      this.setState({
        'results': results,
        'clipboardMessage': clipboardMessage
      });
    });
  }

  render(){

    return (
      <div>
        <SearchForm executeSearch={this.executeSearch} onChangeTagValue={this.onChangeTagValue} />

        <Results results={this.state.results} />
      </div>
    );
  }
}
