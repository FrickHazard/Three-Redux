import React from 'react';
import { connect } from 'react-redux';
import { MainCanvas } from './MainCanvas';
import { StateType } from '../state/reducer/types';

type Props = ReturnType<typeof mapStateToProps>;

class MainComponent extends React.Component<Props> {
  render () {
    return (
      <div>
        <MainCanvas/>
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  gameStarted: state.mainMenu.gameStarted,
});

export const Body = connect(mapStateToProps)(MainComponent);