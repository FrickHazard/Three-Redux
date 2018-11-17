import React from 'react';

class InputModuleComponent extends React.Component<{}> {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    
  }

  render () {
    return (
      <div style={{ display: 'none' }}>
      </div>
    );
  }
}

export const InputModule = (InputModuleComponent);