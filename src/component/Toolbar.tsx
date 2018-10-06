import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MainCanvas } from './MainCanvas';
import { StateType } from '../state/reducer/index';
import { ActionType } from '../state/reducer/types';
import { setBallPosition } from '../state/action/ball';

type State = {
  inputX: number;
  inputY: number;
  inputZ: number;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ToolbarComponent extends React.Component<Props, State> {
  state: State = {
    inputX: 0,
    inputY: 0,
    inputZ: 0,  
  }
  onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    coordinateAxis: 'X' | 'Y' | 'Z'
  ) => {
    switch (coordinateAxis) {
      case 'X': {
        this.setState({ inputX: event.target.valueAsNumber });
        break;
      }
      case 'Y': {
        this.setState({ inputY: event.target.valueAsNumber });
        break;
      }
      case 'Z': {
        this.setState({ inputZ: event.target.valueAsNumber });
        break;
      }

    }
  }
  render () {
    return (
      <div style={{ 
        width: 50
      }}>
        <input
          type="number"
          value={this.state.inputX}
          onChange={event => this.onChangeInput(event, 'X')}
        />
        <input
          type="number"
          value={this.state.inputY}
          onChange={event => this.onChangeInput(event, 'Y')}
        />
        <input
          type="number"
          value={this.state.inputZ}
          onChange={event => this.onChangeInput(event, 'Z')}
        />
        <button
          onClick={() => this.props.setBallPosition(this.state.inputX, this.state.inputY, this.state.inputZ)}
        >
          Submit
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  gameStarted: state.mainMenu.gameStarted,
});

const mapDispatchToProps = (dispatch: Dispatch<ActionType>) => bindActionCreators({
  setBallPosition,
}, dispatch);

export const Toolbar = connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);