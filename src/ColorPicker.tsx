import * as React from 'react';
import styled from 'styled-components';
import { HSVState, HSLState } from './types';
import Slider from './Slider';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import LightbulbIcon from '@material-ui/icons/LightbulbOutline';

import tinycolor = require('tinycolor2');

const hsv2hslString = (hsv: HSVState): string => {
  return tinycolor
    .fromRatio({
      h: hsv.h / 360,
      s: hsv.s / 100,
      v: hsv.v / 100,
    })
    .toHslString();
};

const getHueBackground = (hsv: HSVState) => {
  const color = tinycolor.fromRatio({
    h: hsv.h / 360,
    s: hsv.s / 100,
    v: hsv.v / 100,
  });
  const hsl = color.toHsl();

  return `linear-gradient(
    to right,
    hsl(0,   ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 0%,
    hsl(60,  ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 16%,
    hsl(120, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 33%,
    hsl(180, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 50%,
    hsl(240, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 67%,
    hsl(300, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 83%,
    hsl(360, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%) 100%
  )`;
};

const getSaturationBackground = (hsv: HSVState) => {
  const color1 = tinycolor.fromRatio({ h: hsv.h / 360, s: 0, v: hsv.v / 100 });
  const color2 = tinycolor.fromRatio({ h: hsv.h / 360, s: 1, v: hsv.v / 100 });

  return `linear-gradient(
    to right,
    ${color1.toHslString()} 0%,
    ${color2.toHslString()} 100%
  )`;
};

const getValueBackground = (hsv: HSVState) => {
  const color1 = tinycolor.fromRatio({ h: hsv.h / 360, s: hsv.s / 100, v: 0 });
  const color2 = tinycolor.fromRatio({ h: hsv.h / 360, s: hsv.s / 100, v: 1 });

  return `linear-gradient(
    to right,
    ${color1.toHslString()} 0%,
    ${color2.toHslString()} 100%
  )`;
};

const PickerContainer = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 320px;
  background: #fff;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

interface Props {
  color: HSVState;
  onChange: (color: HSVState) => void;
}

interface State {
  active: boolean;
}

export default class ColorPicker extends React.Component<Props, State> {
  canvasRef = React.createRef();

  state = {
    active: false,
  };

  handleClick = (e: any) => {
    e.stopPropagation();
    this.setState(state => ({ active: !state.active }));
  };
  handleClose = (e: any) => {
    e.stopPropagation();
    this.setState(state => ({ active: false }));
  };

  handleHueChange = (h: number) => {
    h *= 360;
    this.props.onChange({ ...this.props.color, h });
  };

  handleSaturationChange = (s: number) => {
    s *= 100;
    this.props.onChange({ ...this.props.color, s });
  };

  handleValueChange = (v: number) => {
    v *= 100;
    this.props.onChange({ ...this.props.color, v });
  };

  renderPicker = () => {
    if (!this.state.active) return null;

    return (
      <PickerContainer>
        <Cover onClick={this.handleClose} />
        <Typography>Hue:</Typography>
        <Slider
          background={getHueBackground(this.props.color)}
          value={this.props.color.h / 360}
          onChange={this.handleHueChange}
        />
        <Typography>Saturation:</Typography>
        <Slider
          background={getSaturationBackground(this.props.color)}
          value={this.props.color.s / 100}
          onChange={this.handleSaturationChange}
        />
        <Typography>Brightness:</Typography>
        <Slider
          background={getValueBackground(this.props.color)}
          value={this.props.color.v / 100}
          onChange={this.handleValueChange}
        />
      </PickerContainer>
    );
  };

  render() {
    return (
      <div>
        <Avatar
          style={{
            backgroundColor: hsv2hslString(this.props.color),
            margin: 8,
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.6)',
          }}
          onClick={this.handleClick}
        >
          <LightbulbIcon />
        </Avatar>
        {this.renderPicker()}
      </div>
    );
  }
}
