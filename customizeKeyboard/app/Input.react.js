import React, { Component } from 'react';
import AppDispatcher from './dispatcher/AppDispatcher';
import './main.less';

class Input extends Component {
  constructor() {
    super(...arguments);
    this.state={
      numberValue: 0,
      textValue: ''
    };

    this.openNumberDialog = this.openNumberDialog.bind(this);
    this.focus = this.focus.bind(this);
  }

  openNumberDialog() {
    console.log('open NumberDialog');
    AppDispatcher.dispatch({
      actionType: 'openNumberInputDialog',
      callback: (num) => {
        this.numberElement.textContent = Number(num);
        //this.props.onChange && this.props.onChange(this.props.name, Number(num));
        },
      number: this.numberElement.textContent
    });
  }

  focus(e) {
    let target = e.target;
    console.log('open textInput');
    AppDispatcher.dispatch({
      actionType: 'openTextInputDialog',
      callback:(text) => {
        target.value = text;
        },
      text: target.value,
      input: target
    });
  }

  render() {
    return(
      <div>
        <span>Number Input</span>
        <div className="number-input" onTouchStart={this.openNumberDialog} ref={(number) => {this.numberElement = number;}}>{this.state.numberValue}</div>
        <span>Text Input</span>
        <input className='text-input' type='text' placeholder='edit text' ref={(text) => {this.textElement = text;}} value={this.state.textValue}  onFocus={this.focus.bind(this)}/>
      </div>
    );
  }
}

export default Input;