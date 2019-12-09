import React from 'react';

class MiniView extends React.Component {
  // PROPS
  // containerRef
  // selectedFile
  // size
  // pos
  // origDims

  constructor(props) {
    super(props);
    this.state = {
      miniSize: null,
      miniPos: null,
      bgSize: null,
      bgPos: null
    };
    this.miniRef = React.createRef();
  }

  componentDidMount() {
    let bgSize = this.getBgSize();
    let initPos = this.getInitPos(bgSize);
    this.setState({
      bgSize: bgSize,
      bgPos: initPos,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedFile !== this.props.selectedFile) {
      let bgSize = this.getBgSize();
      let initPos = this.getInitPos(bgSize);
      this.setState({
        bgSize: bgSize,
        bgPos: initPos,
      });
    }

  }

  getBgSize = () => {
    var ratioY = this.props.origDims.height / this.miniRef.current.offsetHeight;
    var initSizeY = this.props.origDims.height / ratioY;
    var initSizeX = this.props.origDims.width / ratioY;

    var newRatioX = initSizeX / this.miniRef.current.offsetWidth;
    if (newRatioX >= 1) {
      initSizeX = this.miniRef.current.offsetWidth;
      initSizeY = initSizeY / newRatioX;
    }
    return { width: initSizeX, height: initSizeY }
  }

  getInitPos = (size) => {

    var posX = (this.miniRef.current.offsetWidth - size.width) / 2;
    var posY = (this.miniRef.current.offsetHeight - size.height) / 2;
    return { x: posX, y: posY };
  }


  render() {
    let miniviewStyle = {};
    let miniBoxStyle = {};
    let blackBoxStyle = {};
    let contStyle = {}

    if (this.state.bgSize !== null) {
      miniviewStyle = {
        backgroundImage: 'url(' + this.props.selectedFile + ')',
        backgroundSize: Math.floor(this.state.bgSize.width) + 'px ' + Math.floor(this.state.bgSize.height) + 'px',
        backgroundPosition: Math.floor(this.state.bgPos.x) + 'px ' + Math.floor(this.state.bgPos.y) + 'px',

      }

      let boxLeftPos = ((-1 * this.props.pos.x / this.props.size.width) * this.state.bgSize.width) + this.state.bgPos.x
      let boxTopPos = ((-1 * this.props.pos.y / this.props.size.height) * this.state.bgSize.height) + this.state.bgPos.y
      let boxWidth = ((this.props.containerRef.current.offsetWidth / this.props.size.width) * this.state.bgSize.width);
      let boxHeight = ((this.props.containerRef.current.offsetHeight / this.props.size.height) * this.state.bgSize.height);

      if (this.state.bgSize.width / this.state.bgSize.height > this.miniRef.current.offsetWidth / this.miniRef.current.offsetHeight) {
        if (boxLeftPos < this.state.bgPos.x + 1) {
          boxLeftPos = this.state.bgPos.x + 1;
        }
        if (boxTopPos < this.state.bgPos.y) {
          boxTopPos = this.state.bgPos.y
        }

        if (boxLeftPos + boxWidth > this.state.bgPos.x + this.state.bgSize.width - 1) {
          boxWidth = this.miniRef.current.offsetWidth - boxLeftPos - (this.state.bgPos.x) - 1
        } else {
        }

        if (boxTopPos + boxHeight > this.state.bgPos.y + this.state.bgSize.height - 2) {
          boxHeight = this.miniRef.current.offsetHeight - boxTopPos - (this.state.bgPos.y) - 2;
        }
      } else {
        if (boxLeftPos < this.state.bgPos.x) {
          boxLeftPos = this.state.bgPos.x;
        }
        if (boxTopPos < this.state.bgPos.y + 2) {
          boxTopPos = this.state.bgPos.y + 1
        }

        if (boxLeftPos + boxWidth > this.state.bgPos.x + this.state.bgSize.width - 2) {
          boxWidth = this.miniRef.current.offsetWidth - boxLeftPos - (this.state.bgPos.x) - 2
        } else {
        }

        if (boxTopPos + boxHeight > this.state.bgPos.y + this.state.bgSize.height - 1) {
          boxHeight = this.miniRef.current.offsetHeight - boxTopPos - (this.state.bgPos.y) - 1
        }
      }

      miniBoxStyle = {
        top: boxTopPos,
        left: boxLeftPos,
        width: boxWidth,
        height: boxHeight,
        backgroundImage: 'url(' + this.props.selectedFile + ')',
        backgroundPosition: -(boxLeftPos - ((this.miniRef.current.offsetWidth - this.state.bgSize.width) / 2)) + 'px ' + -(boxTopPos - ((this.miniRef.current.offsetHeight - this.state.bgSize.height) / 2)) + 'px',
        backgroundSize: Math.floor(this.state.bgSize.width) + 'px ' + Math.floor(this.state.bgSize.height) + 'px',
        zIndex: 2,
      }
      blackBoxStyle = {
        width: Math.floor(this.state.bgSize.width) + 'px',
        height: Math.floor(this.state.bgSize.height) + 'px',
        background: '#000000',
        left: Math.floor(this.state.bgPos.x),
        top: Math.floor(this.state.bgPos.y),
        position: 'absolute',
        zIndex: 1,
        opacity: 0.6
      }

      contStyle = {
        position: 'relative'
      }

    }
    return (<>

      <div id="cont" style={contStyle}>
        <div ref={this.miniRef} id="mini-view-container" style={miniviewStyle}>
          <div id="mini-box" style={miniBoxStyle}></div>
        </div >
        <div style={blackBoxStyle}></div>
      </div>
    </>
    )
  }

}

export default MiniView;
