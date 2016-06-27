import React, { Component } from 'react';

import Result from './Result';

export default class ResultList extends Component {
  render(){
    let results = this.props.results;

    return (
      <table role="table" className="table table-striped">
        <thead>
          <tr>
            <th className="col-sm-3">Password</th>
            <th className="col-sm-8">Tags</th>
            <th className="col-sm-1"></th>
          </tr>
        </thead>
        <tbody>
          {results.map( (result) => {
            return <Result key={result.key} result={result} />;
          } )}
        </tbody>
      </table>
    );
  }
}
