import React from 'react';
import { Popover, Icon } from 'antd';
import FirebaseUi from './FirebaseUi';
import firebase from 'firebase';


function onClickSignOut() {
  firebase.auth().signOut();
}

export default function SignIn(props) {

  let button = props.user ? <div className='sign-out' onClick={onClickSignOut}> <Icon type="logout" /> Sign Out</div> : (
    <Popover placement="rightBottom" content={<FirebaseUi />} trigger="hover">
      <div className='sign-in'> <Icon type="login" /> Sign In</div>
    </Popover>);

  return button;
};


