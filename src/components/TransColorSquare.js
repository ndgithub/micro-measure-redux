import React from 'react';

const TransColorSquare = (props) => {
  const style = {
    backgroundImage: "url('images/transcolor.png')",
    backgroundSize: 'cover',
  }
  return (
    <div className="color-square"
      data-color="#ffffff00"
      style={style}
      onClick={(e) => {
        props.onClickColor(e.target.dataset.color)
      }}>

    </div>
  )
}
export default TransColorSquare;


