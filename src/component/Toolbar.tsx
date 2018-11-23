import React from 'react';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';

// type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ToolbarComponent extends React.Component<{}> {

  render () {
    return (
      <Navbar inverse style={{ marginBottom: 0 }}>
        <Navbar.Header>
          <Navbar.Brand>
            <p>Title</p>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

export const Toolbar = connect(() => ({}))(ToolbarComponent);