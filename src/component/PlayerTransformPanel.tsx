import React from 'react';
import { playerTransformLogSnaffleBitProvider  } from '../../index';
import { PlayerTransformData } from '../state/playerTransformLoggerStore';

class PlayerTransform extends React.Component<{}, PlayerTransformData> {
  bit = playerTransformLogSnaffleBitProvider.createRoot([
    {
      selector: (state) => state[0],
      callback: (data) => this.setState(data),
    }
  ]);
  componentWillUnmount() {
    this.bit.dispose();
  }

  render() {
    if (!this.state) return null;
    return <div>
      <div>
        <span>X: {this.state.position.x.toFixed(2)}</span>
      </div>
      <div>
        <span>Y: {this.state.position.y.toFixed(2)}</span>
      </div>
      <div>
        <span>Z: {this.state.position.z.toFixed(2)}</span>
      </div>
      <div>
        <span>Pitch: {this.state.pitch.toFixed(2)}</span>
      </div>
      <div>
        <span>Yaw: {this.state.yaw.toFixed(2)}</span>
      </div>
    </div>;
  }
}

export const PlayerTransformPanel = (PlayerTransform);