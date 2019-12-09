import React from 'react';
import CollectionCreateForm from './CollectionCreateForm';
import axios from 'axios';
import SignIn from './SignIn';
import firebase from 'firebase';

class FeedbackButton extends React.Component {
  state = {
    visible: false
  };

  componentDidMount() {
    // startFirebaseUI('#firebaseui');
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSend = () => {
    const form = this.formRef.props.form;
    console.log('sup');
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      axios
        .post('http://localhost:3001/send-feedback', {
          email: values.email,
          feedback: values.feedback
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });

      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  onClickSignOut = () => {
    firebase.auth().signOut();
  };

  render() {
    return (
      <div className="feedback-container">
        {/* <SignIn user={this.props.user} /> */}
        <div className="feedback">feedback@micromeasure.app</div>
      </div>
    );
  }
}

export default FeedbackButton;
