import * as React from 'react';

import CssBaseline from 'material-ui/CssBaseline';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import SvgIcon from 'material-ui/SvgIcon';
import { withStyles, WithStyles, Theme } from 'material-ui/styles';

import { MenuItem } from 'material-ui/Menu';
import EmailIcon from 'material-ui-icons/Email';
import AppIcon from 'material-ui-icons/Apps';
import Switch from 'material-ui/Switch';
import { lensPath, over } from 'ramda';
import Select from 'material-ui/Select';

const styles = ({ typography }: Theme) => ({
  heading: {
    fontSize: typography.pxToRem(15),
  },
});

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { SketchPicker } from 'react-color';
import {
  HSVState,
  Luminaire,
  SerializedLuminaire,
  HSLState,
  Effect,
} from './types';
import ColorPicker from './ColorPicker';
import styled from 'styled-components';

interface Props {
  luminaire: SerializedLuminaire;
  handleChangeColor: (
    luminaireId: string,
    index: number,
    color: HSVState,
  ) => void;
  handleChangeEffect: (luminaireId: string, effect: string) => void;
}

const SwatchContainer = styled.div`
  display: flex;
`;

// @ts-ignore
const Header = styled.div.attrs({
  style: ({ background }: { background: string }) => ({
    background,
  }),
})`
  display: flex;
  align-items: center;
`;

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

const getLuminaireBackground = (colors: HSVState[]): string => {
  if (colors.length === 1) {
    return hsv2hslString(colors[0]);
  }

  return `linear-gradient(
    to right,
    ${colors.map(
      (color, index) =>
        `${hsv2hslString(color)} ${Math.round(index / colors.length * 100)}%`,
    )}
  )`;
};

export default class LuminairePanel extends React.Component<Props> {
  onChangeColor = (index: number) => (color: HSVState) => {
    const { luminaire, handleChangeColor } = this.props;
    handleChangeColor(luminaire.id, index, color);
  };

  onChangeEffect = (index: number) => (effect: string) => {
    const { luminaire, handleChangeEffect } = this.props;
    handleChangeEffect(luminaire.id, effect);
  };

  render() {
    const { luminaire } = this.props;

    return (
      <React.Fragment>
        <ExpansionPanel>
          <ExpansionPanelSummary
            style={{ background: getLuminaireBackground(luminaire.colors) }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Header>
              <ColorPicker
                color={luminaire.colors[0]}
                onChange={this.onChangeColor(-1)}
              />
              <Typography gutterBottom variant="headline" component="h2">
                {luminaire.id}
              </Typography>
            </Header>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Select
              value={this.props.luminaire.effects}
              onChange={this.handleChangeEffect}
              displayEmpty
              name="Effect"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <SwatchContainer>
              {luminaire.colors.map((color, index) => (
                <ColorPicker
                  key={index}
                  color={color}
                  onChange={this.onChangeColor(index)}
                />
              ))}
            </SwatchContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </React.Fragment>
    );
  }
}
