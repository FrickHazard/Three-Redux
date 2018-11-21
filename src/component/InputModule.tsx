import React from 'react';
import { inputDataStore } from '../../index';

class InputModuleComponent extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 38) {
      inputDataStore.setMoveBack(true);
     }
     else if (event.keyCode === 40) {
       inputDataStore.setMoveFoward(true);
     }
     else if (event.keyCode === 37) {
       inputDataStore.setMoveRight(true);
     }
     else if (event.keyCode === 39) {
       inputDataStore.setMoveLeft(true);
     }
     else if (event.keyCode === 33) {
       inputDataStore.setMoveUp(true);
     }
     else if (event.keyCode === 34) {
       inputDataStore.setMoveDown(true);
     }
 
     else if (event.keyCode === 65) {
       inputDataStore.setLookDown(true);
     }
     else if (event.keyCode === 68) {
       inputDataStore.setLookUp(true);
     }
     else if (event.keyCode === 87) {
       inputDataStore.setLookLeft(true);
     }
     else if (event.keyCode === 83) {
       inputDataStore.setLookRight(true);
     }
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 38) {
      inputDataStore.setMoveBack(false);
     }
     else if (event.keyCode === 40) {
       inputDataStore.setMoveFoward(false);
     }
     else if (event.keyCode === 37) {
       inputDataStore.setMoveRight(false);
     }
     else if (event.keyCode === 39) {
       inputDataStore.setMoveLeft(false);
     }
     else if (event.keyCode === 33) {
       inputDataStore.setMoveUp(false);
     }
     else if (event.keyCode === 34) {
       inputDataStore.setMoveDown(false);
     }
 
     else if (event.keyCode === 65) {
       inputDataStore.setLookDown(false);
     }
     else if (event.keyCode === 68) {
       inputDataStore.setLookUp(false);
     }
     else if (event.keyCode === 87) {
       inputDataStore.setLookLeft(false);
     }
     else if (event.keyCode === 83) {
       inputDataStore.setLookRight(false);
     }
  }

  render () {
    return (
      <div style={{ display: 'none' }}>
      </div>
    );
  }
}

export const InputModule = (InputModuleComponent);