import React from 'react';
import { saveAs } from 'file-saver';

class Snapshot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 'Untitled',
      inputStyle: null,
    };
    this.inputRef = React.createRef();
  }

  clickDownload = () => {
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    }
    saveAs(new Blob([dataURItoBlob(this.props.imgSrc)], { type: 'image/jpeg' }), this.state.inputValue)
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) this.inputRef.current.blur();
  }

  componentDidMount() {

    this.inputRef.current.focus();
    this.inputRef.current.select();
  }

  componentDidUpdate() {
  }

  render() {


    return (
      <div className='snapshot-container'>
        <div className="snapshot-img-container">
          <img src={this.props.imgSrc} alt='' className='snapshot'></img>
        </div>
        <div className="snapshot-input-fields">
          <input ref={this.inputRef} className='title-input-field' type="text" id="blah" value={this.state.inputValue}
            style={this.state.inputStyle} onKeyDown={this.onKeyDown} onChange={(e) => this.setState({ inputValue: e.target.value })} />
          {/* <a href={this.blobUrl} download={this.state.inputValue}>Downloasd</a> */}
          <div className="download-link" onClick={this.clickDownload} >Download</div>

        </div>
      </div >
    )
  }

}

export default Snapshot;