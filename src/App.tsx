import * as React from 'react';

import CssBaseline from 'material-ui/CssBaseline';
import Luminaires from './Luminaires';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline />

        <Luminaires />
      </div>
    );
  }
}
