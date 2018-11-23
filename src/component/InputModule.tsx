import React from 'react';
import { inputDataStore } from '../../index';

class InputModuleComponent extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
  }

  keyDown = (event: KeyboardEvent) => {
    this.toggleKey(event, true)
  }
 
  keyUp = (event: KeyboardEvent) => {
    this.toggleKey(event, false)
  }

  toggleKey = (event: KeyboardEvent, value: boolean) => {
    if (event.keyCode === 38) {
      inputDataStore.setMoveBack(value);
     }
     else if (event.keyCode === 40) {
       inputDataStore.setMoveFoward(value);
     }
     else if (event.keyCode === 37) {
       inputDataStore.setMoveRight(value);
     }
     else if (event.keyCode === 39) {
       inputDataStore.setMoveLeft(value);
     }
     else if (event.keyCode === 33) {
       inputDataStore.setMoveUp(value);
     }
     else if (event.keyCode === 34) {
       inputDataStore.setMoveDown(value);
     }
 
     else if (event.keyCode === 65) {
       inputDataStore.setLookLeft(value);
     }
     else if (event.keyCode === 68) {
       inputDataStore.setLookRight(value);
     }
     else if (event.keyCode === 87) {
       inputDataStore.setLookDown(value);
     }
     else if (event.keyCode === 83) {
       inputDataStore.setLookUp(value);
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