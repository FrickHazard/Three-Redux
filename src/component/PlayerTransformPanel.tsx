import React from 'react';
import { playerTransformDataStore  } from '../../index';
import { PlayerTransformData } from '../state/dataStore/playerTransform';
import { Unsubscribe } from '../snaffle-bit';

class PlayerTransform extends React.Component<{}, PlayerTransformData> {
  private unsubscribe?: Unsubscribe;
  componentWillMount() {
    this.unsubscribe = playerTransformDataStore.subscribe(this.setPlayerTransform);
  }
  
  componentWillUnmount() {
    this.unsubscribe!();
  }

  setPlayerTransform = (data: PlayerTransformData) => this.setState(data)

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