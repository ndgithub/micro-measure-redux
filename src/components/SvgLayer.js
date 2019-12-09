import React from 'react';

class SvgLayer extends React.Component {
  constructor(props) {
    super(props);

    this.setState = {

    }

  }



  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {


  }

  convertToContainerPos = (imagePos) => {
    let x = this.props.pos.x + (this.props.size.width * imagePos.x)
    let y = this.props.pos.y + (this.props.size.height * imagePos.y)
    return { x, y };
  }

  getColor = (lineObj) => {
    if (lineObj.isHover === true) {
      return '#ff0000';

    } else {
      return '#1890ff'
    }
  }




  render() {
    let textStyle = null;
    let textLength = null;
    return (
      <>
        <svg id='svg' width={this.props.containerRef.current.offsetWidth} height={this.props.containerRef.current.offsetWidth}>
          {
            this.props.measureLines.length > 0 && this.props.measureLines.map(lineObj => {
              console.log(lineObj.lengthUnits)
              let pt1 = this.convertToContainerPos(lineObj.pt1);
              let pt2 = this.convertToContainerPos(lineObj.pt2);
              textStyle = {
                position: 'absolute',
                left: pt1.x,
                top: pt1.y - 32,
                color: 'black',
                background: 'white',
                padding: '4px'
              }
              textLength = String(lineObj.lengthUnits);
              return (
                <>
                  <line key={lineObj.id} x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y}
                    style={{ stroke: this.getColor(lineObj), strokeWidth: 4 }}
                    onMouseOver={() => this.props.setLineHover(lineObj.id, true)}
                    onMouseLeave={() => this.props.setLineHover(lineObj.id, false)} />

                  <circle key={lineObj.id + 'pt1'} cx={pt1.x} cy={pt1.y} r={4} fill="#ffffff"
                    stroke="#000000" strokeWidth="2"
                    onMouseOver={() => this.props.setLineHandleHover(lineObj.id, 1)}
                    onMouseLeave={() => this.props.setLineHandleHover(lineObj.id, 0)}
                    visibility={lineObj.isSelected === true ? 'visible' : 'hidden'} />

                  <circle key={lineObj.id + 'pt2'} cx={pt2.x} cy={pt2.y} r={4} fill="#ffffff"
                    stroke="#000000" strokeWidth="2"
                    onMouseOver={() => this.props.setLineHandleHover(lineObj.id, 2)}
                    onMouseLeave={() => this.props.setLineHandleHover(lineObj.id, 0)}
                    visibility={lineObj.isSelected === true ? 'visible' : 'hidden'} />
                </>
              )
            })
          } />
      </svg >
        {this.props.measureLines.length > 0 && this.props.measureLines.map(lineObj => {
          let pt1 = this.convertToContainerPos(lineObj.pt1);
          textStyle = {
            position: 'absolute',
            left: pt1.x,
            top: pt1.y - 42,
            color: 'black',
            background: 'white',
            padding: '4px'
          }
          return <div className="length-text-box" style={textStyle}>{lineObj.lengthUnits} {this.props.inputUnitsValue}</div>
        })}
      </>
    )
  }


}

export default SvgLayer;


