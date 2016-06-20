import React, { Component } from 'react';

export default class Results extends Component {
  render(){
    let results = this.props.results;

    return (
      <table role="table" className="table table-striped">
        <thead>
          <tr><th>Results</th></tr>
        </thead>
        <tbody>
          {results.map( (result) => {
            return <tr><td>{result}</td></tr>;
          } )}
        </tbody>
      </table>
    );
  }
}
