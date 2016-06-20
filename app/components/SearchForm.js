import React, { Component } from 'react';

export default class SearchForm extends Component {
  render(){
    return (
      <form role="form" className="form-inline" onSubmit={this.props.executeSearch}>
        <div className="form-group">
          <input className="form-control" type="text" onChange={this.props.onChangeTagValue} placeholder="enter tag" />
        </div>
        <div className="form-group">
          <button className="btn btn-primary">Search</button>
        </div>
      </form>
    )
  }
}
