import React from 'react';

const ColorSquare = (props) => {
  const style = {
    backgroundColor: props.color
  }
  return (
    <div className="color-square"
      data-color={props.color}
      style={style}
      onClick={(e) => {
        props.onClickColor(e.target.dataset.color)
      }}>

    </div>
  )
}
export default ColorSquare;