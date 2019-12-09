import React from 'react';
import Sidebar from './Sidebar';
import Micrograph from './Micrograph';
import html2canvas from 'html2canvas';
import MeasureLine from './models/MeasureLine';
import firebase from 'firebase';
import axios from 'axios';



class Main extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      imageLoaded: false,
      size: null,
      pos: null,
      containerRef: null,
      isImageScaleSet: false,
      isScalebarChecked: false,
      isScaleSetInProg: false,
      selectedFile: null,
      origDims: null,
      imgSizeUnits: null,
      units: null,
      snapshots: [],
      scalePts: [],
      inputLengthValue: '',
      inputUnitsValue: '',
      cursorStyle: 'auto',

      scalebarTextColor: '#000000',
      scalebarBgColor: '#ffffff',

      isMeasureLineInProg: false,
      measureLines: [],
      lastMousePos: null,

      user: null,

    };


    this.origDims = null;
    this.isMouseDown = null;
    this.moveLine = null;
    this.lastMousePos = null;
    this.changingLineLength = false;

    this.initFirebase();
  }

  initFirebase = () => {
    let config = {
      apiKey: "AIzaSyB4djUY5Mpv7D47zQzuF_N-KbuRQ6XiEgs",
      authDomain: "fir-auth-practice-9a328.firebaseapp.com",
      databaseURL: "https://fir-auth-practice-9a328.firebaseio.com",
      projectId: "fir-auth-practice-9a328",
      storageBucket: "",
      messagingSenderId: "386709413354"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: firebase.auth().currentUser })
        this.getSnapshotsFromDb();

      } else {
        this.setState({ user: null })
      }
    });
  }

  componentDidMount() {

  }

  componentDidUpdate() {
  }

  getSnapshotsFromDb = () => {
    this.state.user.getIdToken(false).then((idToken) => {

      axios.post('http://localhost:3001/get-snapshots', {

        idToken

      })
        .then((snapshots) => {
          this.setState(prevState => ({
            snapshots: [...prevState.snapshots, ...snapshots.data]
          }));
          console.log(snapshots);
        })
        .catch(function (error) {
          console.log(error);
        });


    });

  }



  useDemoUpload = () => {
    var url = 'https://i.imgur.com/ssPGfDJ.jpg';
    var img = new Image();
    img.onload = () => {
      this.origDims = { width: img.width, height: img.height };
      var initialSize = this.getInitSize();
      var initialPos = this.getInitPos(initialSize);

      this.setState({
        selectedFile: url,
        size: initialSize,
        pos: initialPos,
        origDims: { width: img.width, height: img.height },
        imageLoaded: true,

        isImageScaleSet: false,
        isScalebarChecked: false,
        inputLengthValue: '',
        inputUnitsValue: '',
        scalePts: []
      });
    }
    img.src = url;
  }
  // Called from Sidebar when user uploads file
  handleFileUpload = (event) => {
    if (event.target.files.length === 0) return;
    var url = URL.createObjectURL(event.target.files[0]);
    var img = new Image();
    img.onload = () => {
      this.origDims = { width: img.width, height: img.height };
      var initialSize = this.getInitSize();
      var initialPos = this.getInitPos(initialSize);

      this.setState({
        selectedFile: url,
        size: initialSize,
        pos: initialPos,
        origDims: { width: img.width, height: img.height },
        imageLoaded: true,

        isImageScaleSet: false,
        isScalebarChecked: false,
        isScaleSetInProg: false,
        imgSizeUnits: null,
        units: null,
        inputLengthValue: '',
        inputUnitsValue: '',
        scalePts: [],

        isMeasureLineInProg: false,
        measureLines: [],

      });
    }
    img.src = url;
  };



  getInitSize = () => {
    var ratioY = this.origDims.height / this.state.containerRef.current.offsetHeight;
    var initSizeY = this.origDims.height / ratioY;
    var initSizeX = this.origDims.width / ratioY;

    var newRatioX = initSizeX / this.state.containerRef.current.offsetWidth;
    if (newRatioX >= 1) {
      initSizeX = this.state.containerRef.current.offsetWidth;
      initSizeY = initSizeY / newRatioX;
    }
    return { width: initSizeX, height: initSizeY }
  }

  getInitPos = (size) => {

    var posX = (this.state.containerRef.current.offsetWidth - size.width) / 2;
    var posY = (this.state.containerRef.current.offsetHeight - size.height) / 2;
    return { x: posX, y: posY };
  }

  getNewPosition = (containerRef, oldSize, oldPos, newSize) => {
    let newPos = {};
    let old_containerCenterX_relToImgCorner_percent = ((containerRef.current.offsetWidth / 2) - oldPos.x) / oldSize.width;
    let old_containerCenterY_relToImgCorner_percent = ((containerRef.current.offsetHeight / 2) - oldPos.y) / oldSize.height;

    let new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * newSize.width) + oldPos.x;
    let offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (containerRef.current.offsetWidth / 2);
    newPos.x = oldPos.x - offsetX;

    let new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * newSize.height) + oldPos.y;
    let offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (containerRef.current.offsetHeight / 2);
    newPos.y = oldPos.y - offsetY;

    return newPos;

  }

  /////////////  Prop functions called from Micrograph component ///////////////
  getContainerRef = (ref) => {
    this.setState({ containerRef: ref })
  }

  onMouseScroll = (e) => {
    let newSize = {};
    newSize.width = this.state.size.width * (1 - (0.001 * e.deltaY));
    newSize.height = this.state.size.height * (1 - (0.001 * e.deltaY));

    let newPos = this.getNewPosition(this.state.containerRef, this.state.size, this.state.pos, newSize)

    this.setState({
      size: newSize,
      pos: newPos,
    })

  }

  onCheckUseScalebar = (checked) => {
    this.setState({
      isScalebarChecked: checked
    });
  }

  onClickCancelSetting = () => {
    this.setState({
      isScaleSetInProg: false,
    })
  }

  onClickDoneSetting = () => {

    let imgScalePercX = Math.abs(this.state.scalePts[0].x - this.state.scalePts[1].x);
    // width of image in image units
    let imgSizeUnitsX = this.state.inputLengthValue / imgScalePercX;
    let imgSizeUnitsY = (this.state.origDims.height / this.state.origDims.width) * imgSizeUnitsX
    let imgSizeUnits = {
      width: imgSizeUnitsX,
      height: imgSizeUnitsY
    }
    MeasureLine.prototype.imgSizeUnits = imgSizeUnits;


    this.setState({
      imgSizeUnits: imgSizeUnits,
      isImageScaleSet: true,
      units: this.state.inputUnitsValue,
      isScaleSetInProg: false,
      isScalebarChecked: true,
    })

  }

  onInputLengthChange = (e) => {
    e.preventDefault();
    this.setState({
      inputLengthValue: e.target.value,

    })

  }

  onInputUnitsChange = (e) => {
    e.preventDefault();
    this.setState({
      inputUnitsValue: e.target.value,
    })
  }

  wasDragged = () => {
    let dragged = (this.lastMouseDownPos.x !== this.lastMouseUpPos.x && this.lastMouseDownPos.y !== this.lastMouseUpPos.y);
    return dragged;
  }

  convertToImgPos = (pagePos) => {
    // The posisitoin on the page minus the offset of the container and minuse the offset of the image all divided by image widht
    var imgPtX = (pagePos.x - this.state.containerRef.current.offsetLeft - this.state.pos.x) / this.state.size.width;
    var imgPtY = (pagePos.y - this.state.containerRef.current.offsetTop - this.state.pos.y) / this.state.size.height;
    return { x: imgPtX, y: imgPtY };
  }

  convertToContainerPos = (imagePos) => {
    let x = this.state.pos.x + (this.state.size.width * imagePos.x)
    let y = this.state.pos.y + (this.state.size.height * imagePos.y)
    return { x, y };
  }

  onSaveSnapClicked = () => {
    html2canvas(this.state.containerRef.current, { logging: false, useCORS: true }).then(canvas => {
      let canvDataUrl = canvas.toDataURL();
      if (this.state.user) {
        this.postSnapshotToDb(canvDataUrl);
      }
      this.setState(prevState => ({
        snapshots: [...prevState.snapshots, { dataUrl: canvDataUrl, _id: null }]
      }));
    });
  }

  postSnapshotToDb = (dataUrl) => {
    this.state.user.getIdToken(false).then((idToken) => {

      axios.post('http://localhost:3001/save-snapshot', {
        dataUrl: dataUrl,
        idToken: idToken
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

    });
  }



  onClickSetImageScale = () => {
    this.setState({
      isScaleSetInProg: true,
      isImageScaleSet: false,
      inputLengthValue: '',
      inputUnitsValue: '',
      scalePts: []
    })
  }

  addScalePt = () => {
    this.setState(prevState => ({
      scalePts: [...prevState.scalePts, this.convertToImgPos(this.lastMouseUpPos)]
    }), () => {
      this.setState({
        cursorStyle: ((this.state.isScaleSetInProg && this.state.scalePts.length < 2 ? 'crosshair' : 'auto')),
        isMeasureLineInProg: false,
      })
    });
  }

  onClickScaleTextColor = (color) => {
    this.setState({
      scalebarTextColor: color,
    })
  }

  onClickScaleBgColor = (color) => {
    this.setState({
      scalebarBgColor: color,
    })
  }

  mouseEnter = (e) => {
    this.setState({
      cursorStyle: ((this.state.isScaleSetInProg && this.state.scalePts.length < 2) || this.state.isMeasureLineInProg ? 'crosshair' : 'auto')
    })
  }

  mouseDown = (e) => {
    this.setAllLinesUnselected();
    this.isMouseDown = true;
    this.lastMouseDownPos = {
      x: e.pageX,
      y: e.pageY
    }
    this.lastMousePos = {
      x: e.pageX,
      y: e.pageY
    }
    // creating a new line
    if (this.state.isMeasureLineInProg) {
      this.setState(prevState => ({
        measureLines: [...prevState.measureLines, new MeasureLine(this.convertToImgPos(this.lastMouseDownPos), this.convertToImgPos(this.lastMouseDownPos))]
      }))
      // clicking down on an existing line
    } else if (this.getIndexHovering() > -1) {

      let newArr = this.state.measureLines.map(line => {
        line.isSelected = false; // is this necessary?
        return line;
      })
      newArr.splice(this.getIndexHovering(), 1);// remove the line that s getIndex hovering
      this.setState(prevState => ({
        measureLines: [...newArr, new MeasureLine(prevState.measureLines[this.getIndexHovering()].pt1, prevState.measureLines[this.getIndexHovering()].pt2, true)]
      }));
      // Clicking down on line handle
    } else if (this.getHandleHovering() !== -1) {

      let index = this.getHandleHovering().index;
      this.changingLineLength = true;
      this.changingLineLengthPt = this.getHandleHovering().pt === 1 ? this.state.measureLines[index].pt2 : this.state.measureLines[index].pt1;
      let newArr = this.state.measureLines.map(line => line);
      newArr.splice(index, 1);// remove the line thats' hanlde was grabbed
      this.setState(prevState => ({
        measureLines: [...newArr, prevState.measureLines[index]]
      }));
    } else {
      this.setState({
        cursorStyle: ((this.state.isScaleSetInProg && this.state.scalePts.length < 2) ? 'crosshair' : 'move')
      })
    }
  }



  mouseMove = (e) => {

    e.persist();
    // If trying to drag image
    if (this.isMouseDown && !this.state.isMeasureLineInProg && this.getIndexHovering() === -1 && this.changingLineLength === false) {
      let diffX = this.lastMousePos.x - e.pageX;
      let diffY = this.lastMousePos.y - e.pageY;
      this.lastMousePos = { x: e.pageX, y: e.pageY };
      this.setState({
        pos: {
          x: this.state.pos.x - diffX,
          y: this.state.pos.y - diffY
        },
        cursorStyle: 'move'
      })
      // If trying to draw line
    } else if (this.isMouseDown && this.state.isMeasureLineInProg) {

      this.setState(prevState => ({
        measureLines: [...prevState.measureLines.slice(0, -1), new MeasureLine(this.convertToImgPos(this.lastMouseDownPos), this.convertToImgPos(this.lastMousePos))],

      }));
      this.lastMousePos = { x: e.pageX, y: e.pageY };


      // changing the length og the line with handles
    } else if (this.isMouseDown && this.changingLineLength === true) {
      console.log(this.changingLineLength)
      this.setState(prevState => ({
        measureLines: [...prevState.measureLines.slice(0, -1), new MeasureLine(this.changingLineLengthPt, this.convertToImgPos(this.lastMousePos))],

      }));
      this.lastMousePos = { x: e.pageX, y: e.pageY };
      // dragging line
    } else if (this.isMouseDown && this.getIndexHovering() > -1) {
      let diffX = e.pageX - this.lastMousePos.x;
      let diffY = e.pageY - this.lastMousePos.y;

      let newLine = Object.assign({}, this.state.measureLines[this.state.measureLines.length - 1]);
      let pagePosPt1 = this.convertToContainerPos(newLine.pt1);
      pagePosPt1 = {
        x: pagePosPt1.x + diffX + this.state.containerRef.current.offsetLeft,
        y: pagePosPt1.y + diffY + this.state.containerRef.current.offsetTop
      }

      let pagePosPt2 = this.convertToContainerPos(newLine.pt2);
      pagePosPt2 = {
        x: pagePosPt2.x + diffX + this.state.containerRef.current.offsetLeft,
        y: pagePosPt2.y + diffY + this.state.containerRef.current.offsetTop
      }
      let newImgPt1 = this.convertToImgPos(pagePosPt1)
      let newImgPt2 = this.convertToImgPos(pagePosPt2);

      this.setState(prevState => ({
        measureLines: [...prevState.measureLines.slice(0, -1), new MeasureLine(newImgPt1, newImgPt2, true)],
      }));
      this.lastMousePos = { x: e.pageX, y: e.pageY };

    } else if (!this.isMouseDown && !this.state.isMeasureLineInProg) {
    }
    this.lastMousePos = { x: e.pageX, y: e.pageY }
    //this.logLines('mouseMove');
  }

  mouseUp = (e) => {

    this.isMouseDown = false;
    this.lastMouseUpPos = {
      x: e.pageX,
      y: e.pageY
    }
    if ((this.state.isScaleSetInProg) && !this.wasDragged()) {
      this.addScalePt();
    }
    if ((this.state.isMeasureLineInProg)) {
      this.setState({
        isMeasureLineInProg: false,
        cursorStyle: ((this.state.isScaleSetInProg && this.state.scalePts.length < 2 ? 'crosshair' : 'auto'))
      })
    }
    if ((this.getIndexHovering() > -1)) {
      this.setLineSelected();

    }
    if (this.changingLineLength === true) {
      this.changingLineLength = false;
      this.setLineSelected();
    }
    this.setState({
      cursorStyle: ((this.state.isScaleSetInProg && this.state.scalePts.length < 2 ? 'crosshair' : 'auto')),
      isMeasureLineInProg: false,
    })
  }

  setLineHover = (id, isHover) => {
    // this.logLines();
    let newLines = this.state.measureLines.map((lineObj, i) => {
      let newLine = Object.assign({}, lineObj);
      newLine.isHover = (newLine.id === id) ? isHover : newLine.isHover;
      return newLine;
    })
    this.setState({
      measureLines: newLines,
    })
  }

  // Set line selected, it will always be the last one
  setLineSelected = () => {
    let newLines = this.state.measureLines.map((lineObj, i) => {
      let newLine = Object.assign({}, lineObj);
      newLine.isSelected = false;
      return newLine;
    });
    newLines[newLines.length - 1].isSelected = true;
    this.setState({
      measureLines: newLines,
    })
  }

  setAllLinesUnselected = () => {

    let newLines = this.state.measureLines.map((lineObj, i) => {
      let newLine = Object.assign({}, lineObj);
      newLine.isSelected = false;
      return newLine;
    });
    this.setState({
      measureLines: newLines,
    });
  }


  setLineHandleHover = (id, pt) => {
    console.log('setLineHandle Hover: ' + pt)
    let newLines = this.state.measureLines.map((lineObj, i) => {
      let newLine = Object.assign({}, lineObj);
      newLine.isHandleHover = (newLine.id === id) ? pt : newLine.isHandleHover;
      return newLine;
    })
    this.setState({
      measureLines: newLines,
    }, () => console.log(this.state.measureLines));
  }
  getHandleHovering = () => {
    for (let i = 0; i < this.state.measureLines.length; i++) {
      if (this.state.measureLines[i].isHandleHover === 1 || this.state.measureLines[i].isHandleHover === 2) {
        return { index: i, pt: this.state.measureLines[i].isHandleHover }
      }
    }
    return -1;
  }
  getIndexHovering = () => {
    for (let i = 0; i < this.state.measureLines.length; i++) {
      if (this.state.measureLines[i].isHover === true) {
        return i;
      }
    }
    return -1;
  }

  mouseLeave = (e) => {
    this.isMouseDown = false;
  }

  onClickDrawLine = () => {
    this.setState({
      isMeasureLineInProg: true,
      isScaleSetInProg: false,
    });
  }


  render() {
    console.log('user' + firebase.auth().currentUser);
    return (<div id='main'>
      <Sidebar
        handleFileUpload={this.handleFileUpload}
        onClickScalebarBtn={this.onClickScalebarBtn}
        onSaveSnapClicked={this.onSaveSnapClicked}
        snapshots={this.state.snapshots}
        imageLoaded={this.state.imageLoaded}
        scalePtsLength={this.state.scalePts.length}
        onCheckUseScalebar={this.onCheckUseScalebar}
        isScalebarChecked={this.state.isScalebarChecked}
        isImageScaleSet={this.state.isImageScaleSet}
        onInputLengthChange={this.onInputLengthChange}
        onInputUnitsChange={this.onInputUnitsChange}
        inputLengthValue={this.state.inputLengthValue}
        inputUnitsValue={this.state.inputUnitsValue}
        onClickDoneSetting={this.onClickDoneSetting}
        onClickSetImageScale={this.onClickSetImageScale}
        selectedFile={this.state.selectedFile}
        containerRef={this.state.containerRef}
        size={this.state.size}
        pos={this.state.pos}
        origDims={this.state.origDims}
        useDemoUpload={this.useDemoUpload}
        isScaleSetInProg={this.state.isScaleSetInProg}
        onClickCancelSetting={this.onClickCancelSetting}
        onClickScaleTextColor={this.onClickScaleTextColor}
        onClickScaleBgColor={this.onClickScaleBgColor}
        isMeasureLineInProg={this.isMeasureLineInProg}
        onClickDrawLine={this.onClickDrawLine}
        user={this.state.user}

      />
      <Micrograph
        selectedFile={this.state.selectedFile}
        getContainerRef={this.getContainerRef}
        size={this.state.size}
        pos={this.state.pos}
        imgSizeUnits={this.state.imgSizeUnits}
        imageLoaded={this.state.imageLoaded}
        onMouseScroll={this.onMouseScroll}
        mouseDown={this.mouseDown}
        mouseUp={this.mouseUp}
        mouseMove={this.mouseMove}
        mouseLeave={this.mouseLeave}
        mouseEnter={this.mouseEnter}
        isImageScaleSet={this.state.isImageScaleSet}
        isScalebarChecked={this.state.isScalebarChecked}
        units={this.state.units}
        scalebarTextColor={this.state.scalebarTextColor}
        scalebarBgColor={this.state.scalebarBgColor}
        isScaleSetInProg={this.state.isScaleSetInProg}
        scalePtsLength={this.state.scalePts.length}
        cursorStyle={this.state.cursorStyle}

        isMeasureLineInProg={this.state.isMeasureLineInProg}
        measureLines={this.state.measureLines}
        setLineHover={this.setLineHover}
        setLineSelected={this.setLineSelected}
        setLineHandleHover={this.setLineHandleHover}

        inputUnitsValue={this.state.inputUnitsValue}

      />
    </div>)
  }

  logLines = (where) => {
    console.log((`<<<< ${where} >>>>`))
    this.state.measureLines.forEach(line => {
      console.log(`${line.id}:${line.isHandleHover}`)
    })
  }


}

export default Main;