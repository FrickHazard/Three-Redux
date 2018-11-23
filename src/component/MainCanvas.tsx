import React from 'react';
import { connect } from 'react-redux';
import { Display } from '../three/Display';
import { StateType } from '../state/redux/reducer';
import { timingSafeEqual } from 'crypto';

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
    const rightShift = this.props.rightToolbarOpen ?
      this.props.rightToolbarWidth : 0; 
    return (
      <div
        style={{
          transition: '0.5s',
          width: `calc(100% - ${rightShift}px)`,
          height: `calc(100% - ${this.props.headerHeight}px)`,
          position: 'absolute',
          objectFit: 'scale-down',
          zIndex: 0,
          lineHeight: 0,
          cursor: 'crosshair',
          userSelect: 'none',
          marginRight: rightShift,
        }}
        ref={(ref) => this.container = ref}
      >
      </div>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  rightToolbarOpen: state.mainMenu.rightToolbarOpen,
  rightToolbarWidth: state.mainMenu.rightToolbarWidth,
  headerHeight: state.mainMenu.headerHeight,
});

export const MainCanvas = connect(mapStateToProps)(MainCanvasComponent);