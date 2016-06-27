import React, { Component } from 'react';

const request = require('superagent');
const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');
const utf8 = require('utf8');

export default class SavePasswordForm extends Component {
  render(){
    return (
      <form role="form" className="form" onSubmit={this.props.savePassword}>

        <div className="row col-sm-3">
          <input className="form-control" type="text" placeholder="enter password" onChange={this.props.onChangeSavePassword} />
        </div>

        <div className="row col-sm-3">
          <input className="form-control" type="text" placeholder="domain (optional)" onChange={this.props.onChangeSaveDomain} />
        </div>

        <div className="row col-sm-4">
          <input className="form-control" type="text" placeholder="tags (optional)" onChange={this.props.onChangeSaveTags} defaultValue={this.props.defaultSaveTags} />
        </div>

        <div className="row">
          <div className="col-sm-2">
            <button className="btn btn-primary">Save Password</button>
          </div>
        </div>
        <br />

        <div className="col-sm-10">
          {this.props.flashMessage}
        </div>
        <br />

      </form>
    )
  }
}
