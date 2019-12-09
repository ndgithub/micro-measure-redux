import React from 'react';
import ColorSquare from './ColorSquare'
import TransColorSquare from './TransColorSquare';

const ColorPicker = (props) => {

  let colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#c49102']
  return (
    <span className="color-picker">

      {colors.map(color => {
        return <ColorSquare color={color} onClickColor={props.onClickColor} />
      })}
      <TransColorSquare onClickColor={props.onClickColor} />
    </span>
  )
}
export default ColorPicker;
