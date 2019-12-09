import React from "react";
import Snapshots from './Snapshots';
import ScalebarOptions from './ScalebarOptions';
import MiniView from './MiniView';
import FileInput from './FileInput';
import SetImageScale from './SetImageScale';
import DrawLineOptions from './DrawLineOptions';
import FeedbackButton from './FeedbackButton';




class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div id="sidebar">


        {this.props.imageLoaded ||
          <FileInput handleFileUpload={this.props.handleFileUpload} useDemoUpload={this.props.useDemoUpload} />
        }

        {this.props.imageLoaded &&
          (<>
            <MiniView
              selectedFile={this.props.selectedFile}
              containerRef={this.props.containerRef}
              size={this.props.size}
              pos={this.props.pos}
              origDims={this.props.origDims} />

            <DrawLineOptions
              onClickDrawLine={this.props.onClickDrawLine}
            />
            <SetImageScale
              scalePtsLength={this.props.scalePtsLength}
              onInputLengthChange={this.props.onInputLengthChange}
              onInputUnitsChange={this.props.onInputUnitsChange}
              onClickDoneSetting={this.props.onClickDoneSetting}
              inputLengthValue={this.props.inputLengthValue}
              inputUnitsValue={this.props.inputUnitsValue}
              isImageScaleSet={this.props.isImageScaleSet}
              onClickSetImageScale={this.props.onClickSetImageScale}
              isScaleSetInProg={this.props.isScaleSetInProg}
              onClickCancelSetting={this.props.onClickCancelSetting}
              handleFileUpload={this.props.handleFileUpload}
            />
            {this.props.isImageScaleSet && <><ScalebarOptions
              onCheckUseScalebar={this.props.onCheckUseScalebar}
              isScalebarChecked={this.props.isScalebarChecked}
              isImageScaleSet={this.props.isImageScaleSet}
              inputUnitsValue={this.props.inputUnitsValue}
              onClickResetScalebar={this.props.onClickResetScalebar}
              showScalebarColorOptions={this.props.showScalebarColorOptions}
              onClickScaleTextColor={this.props.onClickScaleTextColor}
              onClickScaleBgColor={this.props.onClickScaleBgColor}
            /> </>
            }
            {!this.props.isScaleSetInProg && <Snapshots onSaveSnapClicked={this.props.onSaveSnapClicked} snapshots={this.props.snapshots} />}


          </>
          )}

        <FeedbackButton user={this.props.user} />
      </div>
    );
  }

}

export default Sidebar;
