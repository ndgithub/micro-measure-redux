import React from 'react';
import axios from 'axios';

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClickSubmit = () => {
    axios
      .post('/user', {
        firstName: 'Fred',
        lastName: 'Flintstone'
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return <div className="feedback-container"></div>;
  }
}

export default Feedback;
