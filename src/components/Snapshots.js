import React from "react";
import Snapshot from './Snapshot';
import { Button } from 'antd';
import firebase from 'firebase';

function Snapshots(props) {
  console.log(firebase.auth().currentUser)
  return (<>

    <Button id="save-snapshot" onClick={props.onSaveSnapClicked}><i className="fas fa-camera"></i> &nbsp;&nbsp; Take Snapshot</Button>

    <div className="snapshots-list" >
      {props.snapshots.map((obj, i) => <Snapshot key={i} imgSrc={obj.dataUrl} index={i}></Snapshot>).reverse()}

    </div >
  </>)
}

export default Snapshots;