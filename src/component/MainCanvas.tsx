import React from 'react';
import { connect } from 'react-redux';
import { Display } from '../three/Display';
import { StateType } from '../state/redux/reducer';

type Props = ReturnType<typeof mapStateToProps>;

class MainCanvasComponent extends React.Component<Props> {
  public display: Display | null = null;
  public container: HTMLDivElement | null = null;
  componentDidMount() {
    if (this.container) {
      this.display = new Display(this.container);
    }
  }
  render () {
    const marginRight = this.props.rightToolbarStatus ? this.props.rightToolbarStatus : 0;
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed',
          objectFit: 'scale-down',
          zIndex: 0,
          lineHeight: 0,
          cursor: 'crosshair',
          userSelect: 'none',
          marginRight,
        }}
        ref={(ref) => this.container = ref}
      >
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  rightToolbarStatus: state.mainMenu.rightToolbarStatus,
});

export const MainCanvas = connect(mapStateToProps)(MainCanvasComponent);