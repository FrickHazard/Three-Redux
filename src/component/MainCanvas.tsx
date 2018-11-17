import React from 'react';
import { Display } from '../three/Display';

class MainCanvasComponent extends React.Component {
  public display: Display | null = null;
  public container: HTMLDivElement | null = null;
  componentDidMount() {
    if (this.container) {
      this.display = new Display(this.container);
    }
  }
  render () {
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
        }}
        ref={(ref) => this.container = ref}
      >
      </div>
    );
  }
}

export const MainCanvas = (MainCanvasComponent);