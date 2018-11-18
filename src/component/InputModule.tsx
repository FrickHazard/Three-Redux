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
      this.frameBit.addPlayerMovementInput(new Vector3(0, 0, -1));
     }
     else if (event.keyCode === 40) {
       this.frameBit.addPlayerMovementInput(new Vector3(0, 0, 1));
     }
     else if (event.keyCode === 37) {
       this.frameBit.addPlayerMovementInput(new Vector3(1, 0, 0));
     }
     else if (event.keyCode === 39) {
       this.move(new Vector3(-1, 0, 0));
     }
     else if (event.keyCode === 33) {
       this.move(new Vector3(0, 1, 0));
     }
     else if (event.keyCode === 34) {
       this.move(new Vector3(0, -1, 0));
     }
 
     else if (event.keyCode === 65) {
       this.rotatePitch(-playerPitchRotationSpeed);
     }
     else if (event.keyCode === 68) {
       this.rotatePitch(playerPitchRotationSpeed);
     }
     else if (event.keyCode === 87) {
       this.rotateYaw(-playerYawRotationSpeed);
     }
     else if (event.keyCode === 83) {
       this.rotateYaw(playerYawRotationSpeed);
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