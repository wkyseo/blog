import React, { Component } from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Modal from 'react-modal';
import './TextInputDialog.less';

const TEXT_INPUT_LENGTH = 36;

class TextInputDialog extends Component{
  constructor() {
    super(...arguments);
    this.state = {
      modalIsOpen: false,
      text: '',
      callback: null
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.doneCallback = this.doneCallback.bind(this);
    this.textChange = this.textChange.bind(this);
    this.setFocus = this.setFocus.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  doneCallback() {
    console.log('text', this.textValue);
    if(this.state.modalIsOpen) {
      this.textElement.blur();
      this.closeModal();
      this.state.callback(this.textValue);
    }
  }

  textChange() {
    let val = this.textElement.value;
    if(val.length > TEXT_INPUT_LENGTH) {
      this.textElement.value = val.slice(0, TEXT_INPUT_LENGTH);
    }
    this.textValue = this.textElement.value;
  }

  setFocus() {
    this.textElement.focus();
  }

  render() {
    return(
      <Modal
        contentLabel="text-input-dialog"
        isOpen={this.state.modalIsOpen}
        className="text-input-dialog"
        overlayClassName="dialog-overlay">
        <div className="dialog-container" ref="container">
          <textarea onChange={this.textChange} className="text" autoFocus={true} type="text" ref={(text) => {this.textElement = text;}} defaultValue={this.state.text} />
          <div className="mask" ref={(div) => {this.maskElement = div;}} onClick={this.setFocus}></div>
          <div className="done" onTouchStart={this.doneCallback}>{'Done'}</div>
        </div>
      </Modal>
    );
  }

  componentDidMount() {
    let self = this;
    this.AppDispatcherHandle = AppDispatcher.register((action) => {
      if (action.actionType === 'openTextInputDialog') {
        console.log('openning text input dialog');
        self.setState({
          modalIsOpen: true,
          text: action.text,
          callback: action.callback
        });
        self.textValue = action.text;
        action.input && action.input.blur();
      }
    });

    //iPhone or iPad have hideFeature of softKeyboard
    /*if(window._runtime === 'cordova' && /iPhone|iPad/.test(navigator.appVersion)) {
      window.addEventListener('native.keyboardhide', () => {
        self.doneCallback();
      });
    }*/
  }


  componentWillUnmount() {
    AppDispatcher.unregister( this.AppDispatcherHandle );
    /*if(window._runtime === 'cordova' && /iPhone|iPad/.test(navigator.appVersion)) {
      window.removeEventListener('native.keyboardhide');
    }*/
  }
}

export { TextInputDialog };