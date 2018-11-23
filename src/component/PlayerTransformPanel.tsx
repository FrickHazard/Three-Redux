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
  render() {
    return <div>
      <p>{this.state.position.x.toFixed(2)}</p>
      <p>{this.state.position.y.toFixed(2)}</p>
      <p>{this.state.position.z.toFixed(2)}</p>
    </div>;
  }
}

export const PlayerTransformPanel = (PlayerTransform);