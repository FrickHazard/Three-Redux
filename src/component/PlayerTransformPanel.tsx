import React from 'react';
import Label from 'react-bootstrap/lib/Label';
import Panel from 'react-bootstrap/lib/Panel';
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
    const useWhiteSpace: React.CSSProperties = { };
    return <Panel>
      <Panel>
        <Label style={useWhiteSpace}>{'X:     '}</Label>
        <Label bsStyle="default">{this.state.position.x.toFixed(2)}</Label>
      </Panel>
      <Panel>
        <Label style={useWhiteSpace}>{'Y:     '}</Label>
        <Label bsStyle="default">{this.state.position.y.toFixed(2)}</Label>
      </Panel>
      <Panel>
        <Label style={useWhiteSpace}>{'Z:     '}</Label>
        <Label bsStyle="default">{this.state.position.z.toFixed(2)}</Label>
      </Panel>
      <Panel>
        <Label style={useWhiteSpace}>{'Pitch: '}</Label>
        <Label bsStyle="default">{this.state.pitch.toFixed(2)}</Label>
      </Panel>
      <Panel>
        <Label style={useWhiteSpace}>{'Yaw:   '}</Label>
        <Label bsStyle="default">{this.state.yaw.toFixed(2)}</Label>
      </Panel>
    </Panel>;
  }
}

export const PlayerTransformPanel = (PlayerTransform);