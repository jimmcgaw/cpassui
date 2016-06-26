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

  executeSearch(e){
    e.preventDefault();

    // TODO: Ensure no commas appear in the search terms
    let plaintags = this.state.searchValue.trim().split(/\s+/g);

    // Only fetch text, not files or custom data types
    plaintags.push('type:text');

    // Only fetch passwords, not other text like bookmarks, commands, etc
    // plaintags.push('type:password');

    request
      .get('/rows?plaintags=' + plaintags.join(','))
      .use(cryptagdPrefix)
      .end( (err, res) => {
        let results = [];
        let clipboardMessage = '';

        if (err) {
          if (typeof res === 'undefined') {
            clipboardMessage = err.toString();
          } else {
            clipboardMessage = res.body.error;
          }
        } else {
          results = res.body.map((result) => {
            return {
              "key": result.plaintags[0], // id:...
              "password": atob(result.unencrypted),
              "tags": result.plaintags
            };
          });
        }

        this.setState({
          results: results,
          clipboardMessage: clipboardMessage
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
