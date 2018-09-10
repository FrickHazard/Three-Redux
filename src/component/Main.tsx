import React from 'react';
import { connect } from 'react-redux';
import { ActionType, StateType } from '../state/reducer/types';

type Props = ReturnType<typeof mapStateToProps>;

class MainComponent extends React.Component<Props> {
  render () {
    return (<div>{this.props.gameStarted.toString()}</div>);
  }
}

const mapStateToProps = (state: StateType) => ({
  gameStarted: state.mainMenu.gameStarted,
});

export const Main = connect(mapStateToProps)(MainComponent);