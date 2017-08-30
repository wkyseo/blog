import React from 'react';
import { render } from 'react-dom';
import Input from './Input.react';
import {NumberInputDialog} from './dialogs/NumberInputDialog.react';
import {TextInputDialog} from './dialogs/TextInputDialog.react';

render((
  <div>
    <Input/>
    <NumberInputDialog/>
    <TextInputDialog/>
  </div>
), document.getElementById('app-container'));