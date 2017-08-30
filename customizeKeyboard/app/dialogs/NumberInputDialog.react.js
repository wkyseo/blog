import React, { Component } from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Modal from 'react-modal';
import './NumberInputDialog.less';

const MAX_NUMBER_LENGTH = 7;

class NumberInputDialog extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      modalIsOpen: false,
      number: '0',
      callback: null
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  onKeyPressed(e) {
    let self = this;
    let key = e.target.dataset.key;
    if(key) {
      let num = self.state.number;
      let numStr = num + '';
      switch (key) {
        case 'clear':
          num = '0';
          break;
        case 'backspace':
          console.log('backspace');
          if(numStr.length > 1){
            numStr = numStr.substr(0, numStr.length - 1);
            if(numStr !== '-') {
              num = Number(numStr);
            } else {
              num = '-';
            }
          } else {
            numStr = '0';
            num = Number(numStr);
          }

          break;
        case '.':
          if(numStr.indexOf('.') === -1 && numStr.length < MAX_NUMBER_LENGTH) {
            num = numStr + key;
          }
          break;
        case '0':
          if(numStr !== '0' && numStr.length < MAX_NUMBER_LENGTH) {
            num = numStr + key;
          }
          break;
        case '-':
          num = - Number(numStr);
          if (isNaN(num)) {
            num = '0';
          } else if (num === 0) {
            num = '-';
          }

          break;
        case 'cancel':
          self.closeModal();
          break;
        case 'confirm':
          if(self.state.callback){
            let tmp = parseFloat(numStr);
            if (isNaN(tmp)) {
              self.state.callback(1);
            } else {
              self.state.callback(tmp);
            }
          }
          self.closeModal();
          break;
        default:
          if(numStr.length < MAX_NUMBER_LENGTH) {
            numStr += key;
            num = Number(numStr);
          }
          break;
      }
      self.setState({
        number: num
      });
    }
  }

  render() {
    let self = this;
    return (
      <Modal
        contentLabel="number-input-dialog"
        isOpen={self.state.modalIsOpen}
        className="number-input-dialog"
        overlayClassName="dialog-overlay">
        <div className="dialog-container" ref="container" onTouchStart={this.onKeyPressed}>
          <div className="done" data-key='confirm' >{'Done'}</div>
          <div className="number-input-wrap">
            <span className="number-input-display">{self.state.number}</span>
          </div>
          <div className='key-board'>
            <ul className="number-input-keyboard">
              <li className="number-input-key" data-key="1" >1</li>
              <li className="number-input-key" data-key="2" >2</li>
              <li className="number-input-key" data-key="3" >3</li>
              <li className="number-input-key" data-key="4" >4</li>
              <li className="number-input-key" data-key="5" >5</li>
              <li className="number-input-key" data-key="6" >6</li>
              <li className="number-input-key" data-key="7" >7</li>
              <li className="number-input-key" data-key="8" >8</li>
              <li className="number-input-key" data-key="9" >9</li>
              <li className="number-input-key" data-key="." >·</li>
              <li className="number-input-key" data-key="0" >0</li>
              <li className="number-input-key" data-key="-" >-</li>
            </ul>
          </div>
          <div className='option'>
            <div className="number-input-key number-space" data-key="backspace" >
              <img src="./img/icon-number-delete.png" alt="" data-key="backspace"/>
            </div>
            <div className="number-input-key number-clear" data-key="clear" >C</div>
            <div className="number-confirm" data-key='confirm' >{'Done'}</div>
          </div>
        </div>
      </Modal>
    );
  }

  componentDidMount() {
    //let self = this;
    this._register = AppDispatcher.register((action) => {
      if (action.actionType ==='openNumberInputDialog') {
        console.log('openning number input dialog');
        this.setState({
          modalIsOpen: true,
          number: action.number,
          callback: action.callback
        });
      }
    });
  }

  componentWillUnmount() {
    AppDispatcher.unregister( this._register );
  }

}

export { NumberInputDialog };