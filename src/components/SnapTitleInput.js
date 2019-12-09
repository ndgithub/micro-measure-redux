import React from "react";


class SnapTitleInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: null,
    };
    this.inputRef = React.createRef();
  }




  onKeyDown = (e) => {
    if (e.keyCode === 13) e.target.blur();
  }


  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    return (
      <input ref={this.inputRef} className='title-input-field' type="text" id="blah" value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setStyle({ border: 'none' })}
        style={style} />
    )
  }

}

export default SnapTitleInput;
