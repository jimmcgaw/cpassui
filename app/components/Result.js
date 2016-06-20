import React, { Component } from 'react';

import { clipboard } from 'electron';

export default class Result extends Component {
  constructor(props){
    super(props);

    this.onCopyResult = this.onCopyResult.bind(this);
  }

  onCopyResult(){
    let password = this.props.result.split(' ')[0];
    clipboard.writeText(password);
  }

  render(){
    let result = this.props.result;
    return (
      <tr>
        <td>{result}</td>
        <td>
          <button className="btn btn-default" onClick={this.onCopyResult}>copy</button>
        </td>
      </tr>
    );
  }
}
