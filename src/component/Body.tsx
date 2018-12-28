import React from 'react';
import { connect } from 'react-redux';
import { MainCanvas } from './MainCanvas';
import { Toolbar } from './TopToolbar';
import { InputModule } from './InputModule';
import { RightToolbar } from './RightToolbar';
import { StateType } from '../state/redux/reducer/index';

type Props = ReturnType<typeof mapStateToProps>;

class MainComponent extends React.Component<Props> {
  render () {
    return (
      <div>
        <InputModule />
        <Toolbar />
        <main>
          <MainCanvas/>
        </main>
        <RightToolbar />
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  gameStarted: state.mainMenu.gameStarted,
});

export const Body = connect(mapStateToProps)(MainComponent);