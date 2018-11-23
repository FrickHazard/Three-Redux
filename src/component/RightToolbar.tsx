import React from 'react';
import { connect } from 'react-redux';
import Panel from 'react-bootstrap/lib/Panel';
import { StateType } from '../state/redux/reducer';
import { PlayerTransformPanel } from './PlayerTransformPanel';

type Props = ReturnType<typeof mapStateToProps>;

class RightToolbarComponent extends React.Component<Props> {

  render () {
    const width = this.props.rightToolbarStatus ? this.props.rightToolbarStatus : 0;
    return (
      <Panel style={{
        margin: '0, 0, 0, 0',
        height: '100%',
        width,
        position: 'fixed',
        zIndex: 1,
        top: 0,
        right: 0,
        backgroundColor: '#111',
        overflowX: 'hidden',
        transition: '0.5s',
        paddingTop: '60px',
      }}>
        <PlayerTransformPanel/>
      </Panel>
    );
  }
}

const mapStateToProps = (state: StateType) =>({
  rightToolbarStatus: state.mainMenu.rightToolbarStatus,
});

export const RightToolbar = connect(mapStateToProps)(RightToolbarComponent);