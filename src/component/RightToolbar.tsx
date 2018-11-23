import React from 'react';
import { connect } from 'react-redux';
import Panel from 'react-bootstrap/lib/Panel';

// type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class RightToolbarComponent extends React.Component<{}> {

  render () {
    return (
      <div style={{
        height: '100%',
        width: '0',
        position: 'fixed',
        zIndex: 1,
        top: 0,
        left: 0,
        backgroundColor: '#111',
        overflowX: 'hidden',
        transition: '0.5s',
        paddingTop: '60px',
      }}>
        <Panel>

        </Panel>
      </div>
    );
  }
}

export const RightToolbar = connect(() => ({}))(RightToolbarComponent);