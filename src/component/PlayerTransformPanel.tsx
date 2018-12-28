import React from 'react';
import { playerTransformDataStore  } from '../../index';
import { PlayerTransformData } from '../state/dataStore/playerTransform';
import { Unsubscribe } from '../snaffle-bit';
import { extractPosition } from '../library/transformMatrix';

class PlayerTransform extends React.Component<{}, PlayerTransformData> {
  private unsubscribe?: Unsubscribe;
  componentWillMount() {
    this.unsubscribe = playerTransformDataStore.subscribe(this.setPlayerTransform);
  }
  
  componentWillUnmount() {
    this.unsubscribe!();
  }

  setPlayerTransform = () => {
    const transform = playerTransformDataStore.getState();
    this.setState(transform);
  }

  render() {
    if (!this.state) return null;
    const position = extractPosition(this.state.bodyTransformMatrix);
    return <div>
      <div>
        <span>X: {position[0].toFixed(2)}</span>
      </div>
      <div>
        <span>Y: {position[1].toFixed(2)}</span>
      </div>
      <div>
        <span>Z: {position[2].toFixed(2)}</span>
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