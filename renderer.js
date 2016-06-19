// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import React, { Component } from 'react';
import { render } from 'react-dom';

const jQuery = require('jquery');
const { clipboard } = require('electron');
const shelljs = require('shelljs');

class SearchBox extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchValue: '',
      results: ''
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
    let command = 'cpass ' + this.state.searchValue;
    shelljs.exec(command, (code, stdout) => {
      var value = stdout;
      var passwordEntries = stdout.split('\n\n');

      let firstPassword = passwordEntries[0].split(' ')[0];

      var output = [];
      output.push("Added first result `" + firstPassword + "` to clipboard");
      output.push('\n\n');
      output.push(stdout);

      var allOutput = output.join("");
      this.setState({
        'results': allOutput
      });
    });
  }

  render(){
    let results = this.state.results;

    return (
      <div>
        <input onChange={this.onChangeTagValue} />
        <button onClick={this.executeSearch}>Search</button>

        <div>{results}</div>
      </div>
    );
  }
}

render(<SearchBox/>, document.getElementById('root'));

// (function ($) {
//
//   var button = $('#search');
//   var results = $('#results');
//   var searchInput = $('#search-value');
//
//   var executeSearch = function(event){
//     event.preventDefault();
//
//     var searchValue = searchInput.val();
//     var command = 'cpass ' + searchValue;
//
//     shelljs.exec(command, function(code, stdout){
//       var value = stdout;
//       var passwordEntries = stdout.split('\n\n');
//
//       let firstPassword = passwordEntries[0].split(' ')[0];
//       var output = [];
//       output.push("Added first result `" + firstPassword + "` to clipboard");
//       output.push('\n\n');
//       output.push(stdout);
//
//       results.text(output.join(""));
//     });
//
//   }
//
//   button.click(executeSearch);
//   searchInput.keyup(function(e){
//     if (e.keyCode === 13){
//       executeSearch(e);
//     }
//   });
//
//
// })(jQuery);
