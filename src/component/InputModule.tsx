import React from 'react';
import { frameBit, FrameDataSnaffleBit } from '../../index';

class InputModuleComponent extends React.Component<{}> {
  private frameBit: FrameDataSnaffleBit = frameBit.createRoot([
    {
      selector: () => null,
      callback: () => {},
    }
  ]);
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 38) {
      this.frameBit.addPlayerMovementInput({ x: 0, y:0, z: -1 });
     }
     else if (event.keyCode === 40) {
       this.frameBit.addPlayerMovementInput({ x: 0, y:0, z: 1 });
     }
     else if (event.keyCode === 37) {
       this.frameBit.addPlayerMovementInput({ x: 1, y: 0, z: 0 });
     }
     else if (event.keyCode === 39) {
       this.frameBit.addPlayerMovementInput({ x: -1, y: 0, z: 0 });
     }
     else if (event.keyCode === 33) {
       this.frameBit.addPlayerMovementInput({ x: 0, y: 1, z: 0 });
     }
     else if (event.keyCode === 34) {
       this.frameBit.addPlayerMovementInput({ x: 0, y: -1, z: 0});
     }
 
     else if (event.keyCode === 65) {
       this.frameBit.addPlayerLookInput({ x: -0.01, y: 0 });
     }
     else if (event.keyCode === 68) {
       this.frameBit.addPlayerLookInput({ x: 0.01, y: 0 });
     }
     else if (event.keyCode === 87) {
       this.frameBit.addPlayerLookInput({ x: 0, y: -0.01 });
     }
     else if (event.keyCode === 83) {
       this.frameBit.addPlayerLookInput({ x: 0, y: 0.01 });
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