import React from "react";
import { Button, Divider, Icon } from 'antd';

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.inputRef = React.createRef();

  }

  componentDidMount() {
  }

  componentDidUpdate() {

  }
  render() {
    return (<>
      <Button className="choose-file" onClick={() => this.inputRef.current.click()}><Icon className="upload-icon" type="upload" /> &nbsp;&nbsp; Choose Image from Computer</Button>
      <Divider>or</Divider>
      <Button className="choose-file" onClick={this.props.useDemoUpload}><Icon className="upload-icon" type="upload" /> &nbsp;&nbsp;Use The Demo Image</Button>


      <input ref={this.inputRef} type="file" id="file-upload" onChange={(event) => this.props.handleFileUpload(event)} />
    </>
    )
  }

}

export default FileInput;