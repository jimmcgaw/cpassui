import React, { Component } from 'react';

const request = require('superagent');
const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');
const utf8 = require('utf8');

import ResultList from './components/ResultList';
import SearchForm from './components/SearchForm';
import SavePasswordForm from './components/SavePasswordForm';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      // Search
      searchValue: this.defaultSearch(),
      clipboardMessage: '',
      results: [],

      // Save password
      password: '',
      domain: '',
      tags: 'type:password ',
      flashMessage: ''
    };

    this.onChangeTagValue = this.onChangeTagValue.bind(this);
    this.executeSearch = this.executeSearch.bind(this);

    this.onChangeSavePassword = this.onChangeSavePassword.bind(this);
    this.onChangeSaveDomain = this.onChangeSaveDomain.bind(this);
    this.onChangeSaveTags = this.onChangeSaveTags.bind(this);
    this.savePassword = this.savePassword.bind(this);
  }

  defaultSearch(){
    return 'type:password '
  }

  mergeState(obj){
    this.setState(
      Object.assign(this.state, obj)
    )
  }

  onChangeTagValue(e){
    this.mergeState({
      searchValue: e.target.value
    });
  }

  onChangeSavePassword(e){
    this.mergeState({
      password: e.target.value
    });
  }

  onChangeSaveDomain(e){
    this.mergeState({
      domain: e.target.value
    });
  }

  onChangeSaveTags(e){
    this.mergeState({
      tags: e.target.value
    });
  }

  tagByPrefix(plaintags, prefix) {
    for (let i = 0; i < plaintags.length; i++) {
      if (plaintags[i].startsWith(prefix)) {
        return plaintags[i];
      }
    }
    return '';
  }

  executeSearch(e){
    e.preventDefault();

    let plaintags = this.state.searchValue.trim().split(/\s+/g);

    // Only fetch text, not files or custom data types
    plaintags.push('type:text');

    // Only fetch passwords, not other text like bookmarks, commands, etc
    // plaintags.push('type:password');

    request
      .post('/rows/get')
      .use(cryptagdPrefix)
      .send(plaintags)
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
              key: this.tagByPrefix(result.plaintags, 'id:'),
              password: utf8.decode(atob(result.unencrypted)),
              tags: result.plaintags
            };
          });
        }

        this.mergeState({
          results: results,
          clipboardMessage: clipboardMessage
        });
      });
  }

  savePassword(e){
    e.preventDefault();

    let password = this.state.password;
    if (!password) {
      this.mergeState({flashMessage: 'Error: password cannot be empty'});
      return
    }

    // TODO: Clarify to user that tags should be
    // space-separated. Later, make them comma-separated and split on
    // /,\s+/
    let plaintags = this.state.tags.trim().replace(',', '').split(/\s+/g);

    let domain = this.state.domain.trim();
    if (domain) {
      plaintags.push('domain:'+domain);
    }

    // Add tags users should't have to worry about
    plaintags = plaintags.concat(['type:text', 'app:cpassui']);

    let row = {
      unencrypted: btoa(utf8.encode(password)),
      plaintags: plaintags
    }

    request
      .post('/rows')
      .use(cryptagdPrefix)
      .send(row)
      .end( (err, res) => {
        let flashMessage = '';

        if (err) {
          if (typeof res === 'undefined') {
            flashMessage = err.toString();
          } else {
            flashMessage = res.body.error;
          }

          this.mergeState({flashMessage: flashMessage});

          return
        }

        // Success

        let tags = res.body.plaintags;
        flashMessage = 'New password saved with these tags: ' + tags.join(', ')

        this.mergeState({flashMessage: flashMessage});
      });
  }

  render(){
    return (
      <div>
        <div className="row">
          <SavePasswordForm
            defaultSaveTags={this.defaultSearch()}
            savePassword={this.savePassword}
            onChangeSavePassword={this.onChangeSavePassword}
            onChangeSaveDomain={this.onChangeSaveDomain}
            onChangeSaveTags={this.onChangeSaveTags}
            flashMessage={this.state.flashMessage} />

          <SearchForm
            defaultSearch={this.defaultSearch()}
            executeSearch={this.executeSearch}
            onChangeTagValue={this.onChangeTagValue}
            clipboardMessage={this.state.clipboardMessage} />
        </div>

        <ResultList results={this.state.results} />
      </div>
    );
  }
}
