import React from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import axios from 'axios';

class FirebaseUI extends React.Component {
  constructor(props) {
    super(props);

    // this.config = {
    //   apiKey: "AIzaSyB4djUY5Mpv7D47zQzuF_N-KbuRQ6XiEgs",
    //   authDomain: "fir-auth-practice-9a328.firebaseapp.com",
    //   databaseURL: "https://fir-auth-practice-9a328.firebaseio.com",
    //   projectId: "fir-auth-practice-9a328",
    //   storageBucket: "",
    //   messagingSenderId: "386709413354"
    // };

    // This is our firebaseui configuration object
    this.uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInSuccessUrl: '<url-to-redirect-to-on-success>',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // var user = authResult.user;

          // var credential = authResult.credential;

          // var isNewUser = authResult.additionalUserInfo.isNewUser;

          // var providerId = authResult.additionalUserInfo.providerId;

          // var operationType = authResult.operationType;

          console.log('signInSuccessWithAuthResult called');
          this.props.setUser(firebase.auth().currentUser);
          firebase
            .auth()
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then(function(idToken) {
              console.log('hi');
              axios
                .post('http://localhost:3001/token', {
                  idToken
                })
                .then(function(response) {
                  console.log('inside callback' + idToken);
                  console.log({ idToken });
                  window.location.href('public/welcome.html');
                  console.log(response);

                  // Add current snapshots to db, and add pull in old ones.
                })
                .catch(function(error) {
                  console.log(error);
                });

              // Send token to your backend via HTTPS
              // $.post('/token', { idToken }, function (results) {
              //   console.log('inside callback' + idToken);
              //   console.log({ idToken });
              //   window.location.href("public/welcome.html");

              // });
              // console.log(idToken);
            })
            .catch(function(error) {
              console.log(error);
            });

          // Do something with var user = firebase.auth().currentUser;the returned AuthResult.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return false;
        },
        signInFailure: function(error) {
          // Some unrecoverable error occurred during sign-in.
          // Return a promise when error handling is completed and FirebaseUI
          // will reset, clearing any UI. This commonly occurs for error code
          // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
          // occurs. Check below for more details on this.
          //return handleUIError(error);
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          // document.getElementById('loader').style.display = 'none';
        }
      },
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: '<your-tos-url>',
      // Privacy policy url/callback.
      privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
      }
    };

    // This must run before any other firebase functions
    //firebase.initializeApp(this.config);

    // This sets up firebaseui
  }
  componentDidMount() {
    let ui = null;
    if (firebaseui.auth.AuthUI.getInstance()) {
      ui = firebaseui.auth.AuthUI.getInstance();
    } else {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start('#firebaseui', this.uiConfig);
  }

  render() {
    return (
      <>
        <div id="firebaseui"></div>
      </>
    );
  }
}

export default FirebaseUI;

// This adds firebaseui to the page
// It does everything else on its own
