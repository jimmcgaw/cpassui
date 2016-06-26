import React, { Component } from 'react';

const request = require('superagent');
const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');

import ResultList from './components/ResultList';
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

  resultsFromRows(rows){
    let results = [];

    rows.forEach( (row) => {
      results.push({
        "key": row.plaintags[0], // id:...
        "password": atob(row.unencrypted),
        "tags": row.plaintags
      })
    })

    return results;
  }

  executeSearch(e){
    e.preventDefault();

    // TODO: Ensure no commas appear in the search terms
    let plaintags = this.state.searchValue.trim().split(/\s+/g);

    // Only fetch passwords
    // plaintags.push('type:password');

    request
      .get('/rows?plaintags=' + plaintags.join(','))
      .use(cryptagdPrefix)
      .end( (err, res) => {
        if (err) {
          this.setState({
            'results': [],
            'clipboardMessage': res.body.error
          });
          return
        }

        let results = this.resultsFromRows(res.body);

        this.setState({
          'results': results,
          'clipboardMessage': ''
        });
      });
  }

  render(){
    return (
      <div>
        <div className="row">
          <SearchForm
            executeSearch={this.executeSearch}
            onChangeTagValue={this.onChangeTagValue}
            clipboardMessage={this.state.clipboardMessage} />
        </div>

        <ResultList results={this.state.results} />
      </div>
    );
  }
}
