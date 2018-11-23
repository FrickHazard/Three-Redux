import React from 'react';
import { connect } from 'react-redux';
import { StateType } from '../state/redux/reducer';
import { PlayerTransformPanel } from './PlayerTransformPanel';

type Props = ReturnType<typeof mapStateToProps>;

class RightToolbarComponent extends React.Component<Props> {

  render () {

    const width =
      this.props.rightToolbarOpen ?
      this.props.rightToolbarWidth : 0;
    return (
      <div style={{
        height: '100%',
        width,
        position: 'fixed',
        zIndex: 1,
        top: 0,
        right: 0,
        backgroundColor: '#606060',
        overflowX: 'hidden',
        transition: '0.5s',
        paddingTop: '60px',
      }}>
        {this.props.rightToolbarOpen ? <PlayerTransformPanel/> : null}
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) =>({
  rightToolbarOpen: state.mainMenu.rightToolbarOpen,
  rightToolbarWidth: state.mainMenu.rightToolbarWidth,
});

export const RightToolbar = connect(mapStateToProps)(RightToolbarComponent);