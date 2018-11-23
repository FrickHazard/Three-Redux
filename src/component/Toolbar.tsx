import React from 'react';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';
import { Dispatch, bindActionCreators } from 'redux';
import { ActionType } from '../state/redux/reducer/types';
import { StateType } from '../state/redux/reducer';
import { setRightToolbarStatus } from '../state/redux/action/ball';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ToolbarComponent extends React.Component<Props> {

  toggleRightToolBar = () => {
    const status = this.props.rightToolbarStatus ? null: 250;
    this.props.setRightToolbarStatus(status)
  }

  render () {
    return (
      <Navbar inverse style={{ marginBottom: 0 }}>
        <Navbar.Header>
          <Navbar.Brand>
            <Button bsStyle="primary" onClick={this.toggleRightToolBar}>Toolbar</Button>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

const mapStateToProps = (state: StateType) =>({
  rightToolbarStatus: state.mainMenu.rightToolbarStatus,
});

const mapDispatchToProps = (dispatch: Dispatch<ActionType>) => bindActionCreators({
  setRightToolbarStatus,
}, dispatch);

export const Toolbar = connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);