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
          width: '100%',
          height: '100%',
        }}
        ref={(ref) => this.container = ref}
      >
      </div>
    );
  }
}

export const MainCanvas = (MainCanvasComponent);