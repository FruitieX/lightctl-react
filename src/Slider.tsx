import * as React from 'react';
import styled from 'styled-components';
import { HSVState, HSLState } from './types';

// gaah background had to be moved to .attrs for performance reasons,
// but ts does not like it
// @ts-ignore
const SliderBackground = styled.div.attrs({
  style: ({ background }: { background: string }) => ({
    background,
  }),
})`
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
`;

// @ts-ignore
const Pointer = styled.div.attrs({
  style: ({ pos }: { pos: number }) => ({
    left: `${100 * pos}%`,
  }),
})`
  position: absolute;
  width: 32px;
  border-radius: 16px;
  height: 32px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  background: #fff;
  margin-top: 1px;
  transform: translate(-16px, -8px);
`;

interface Props {
  background: string;
  value?: number;
  onChange?: (value: number) => void;
}

export default class Slider extends React.Component<Props> {
  state = { value: 0 };

  container = null;
  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e: MouseEvent) => {
    const container: any = this.container;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    // @ts-ignore
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
    // @ts-ignore
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
    const left =
      x - (container.getBoundingClientRect().left + window.pageXOffset);
    const top =
      y - (container.getBoundingClientRect().top + window.pageYOffset);

    let value;
    if (left < 0) {
      value = 0;
    } else if (left > containerWidth) {
      value = 1;
    } else {
      const percent = left * 100 / containerWidth;
      value = percent / 100;
    }

    if (this.props.value === undefined) {
      this.setState({ value });
    } else if (this.props.onChange) {
      this.props.onChange(value);
    }
    //const change = alpha.calculateChange(e, skip, this.props, this.container);
    //change && this.props.onChange && this.props.onChange(change, e);
  };

  handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    this.handleChange(e);
    window.addEventListener('mousemove', this.handleChange);
    window.addEventListener('mouseup', this.handleMouseUp);

    return false;
  };

  handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    this.unbindEventListeners();

    return false;
  };

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleChange);
    window.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    return (
      <SliderBackground
        // @ts-ignore
        background={this.props.background}
        // @ts-ignore
        innerRef={container => (this.container = container)}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleMouseUp}
        onTouchMove={this.handleChange}
        onTouchStart={this.handleChange}
      >
        <Pointer
          pos={
            this.props.value === undefined ? this.state.value : this.props.value
          }
        />
      </SliderBackground>
    );
  }
}
