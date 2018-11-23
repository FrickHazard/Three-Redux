import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { ActionType } from '../state/redux/reducer/types';
import { StateType } from '../state/redux/reducer';
import { setRightToolbarOpen } from '../state/redux/action/ball';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ToolbarComponent extends React.Component<Props> {

  toggleRightToolBar = () => {
    this.props.setRightToolbarOpen(!this.props.rightToolbarOpen)
  }

  render () {
    return (
      <div style={{ marginBottom: 0, height: `${this.props.headerHeight}px` }}>
        <button onClick={this.toggleRightToolBar}>Toolbar</button>
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) =>({
  rightToolbarOpen: state.mainMenu.rightToolbarOpen,
  headerHeight: state.mainMenu.headerHeight,
});

const mapDispatchToProps = (dispatch: Dispatch<ActionType>) => bindActionCreators({
  setRightToolbarOpen,
}, dispatch);

export const Toolbar = connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);