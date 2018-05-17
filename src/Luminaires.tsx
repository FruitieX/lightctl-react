import * as React from 'react';

import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import SvgIcon from 'material-ui/SvgIcon';
import { withStyles, WithStyles, Theme } from 'material-ui/styles';

import EmailIcon from 'material-ui-icons/Email';
import AppIcon from 'material-ui-icons/Apps';
import { lensPath, set } from 'ramda';

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
import { HSVState, Luminaire, SerializedLuminaire } from './types';
import LuminairePanel from './LuminairePanel';

const decorate = withStyles(styles);
interface Props {}
interface State {
  luminaires: SerializedLuminaire[];
}
type PropsWithStyles = Props & WithStyles<'heading'>;

const colorLens = (luminaireIndex: number, colorIndex: number) =>
  lensPath(['luminaires', luminaireIndex, 'colors', colorIndex]);

const colorsLens = (luminaireIndex: number) =>
  lensPath(['luminaires', luminaireIndex, 'colors']);

export default decorate<Props>(
  class extends React.Component<PropsWithStyles, State> {
    state = {
      luminaires: [
        {
          id: 'Luminaire 1',
          gateway: 'dummy',
          colors: [{ h: 42, s: 20, v: 90 }, { h: 42, s: 42, v: 42 }],
          effects: [],
        },
      ],
    };

    handleChangeColor = (
      luminaireId: string,
      colorIndex: number,
      color: HSVState,
    ) => {
      const { luminaires } = this.state;

      const luminaireIndex = luminaires.findIndex(
        luminaire => luminaire.id === luminaireId,
      );

      if (colorIndex === -1) {
        this.setState(set(colorsLens(luminaireIndex), [color]));
      } else {
        this.setState(set(colorLens(luminaireIndex, colorIndex), color));
      }
    };

    handleChangeEffect = (luminaireId: string, effect: string) => {};

    render() {
      const { classes } = this.props;
      const { luminaires } = this.state;

      return (
        <div>
          {luminaires.map(luminaire => (
            <LuminairePanel
              key={luminaire.id}
              luminaire={luminaire}
              handleChangeColor={this.handleChangeColor}
              handleChangeEffect={this.handleChangeEffect}
            />
          ))}
        </div>
      );
    }
  },
);
