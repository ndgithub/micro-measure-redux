import React from 'react';
import { Button } from 'antd';


class DrawLineOptions extends React.Component {
  constructor(props) {
    super(props);

    this.setState = {

    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    return (
      <Button className='addLine' onClick={this.props.onClickDrawLine}>Measure</Button>
    )

  }

}

export default DrawLineOptions;