import React from 'react';
import { Divider } from 'antd';

const SectionHeader = (props) => {




  return (<><div className="section-header">
    <div className="section-header-title">{props.title}</div>
    {props.children}
  </div>
    <Divider />
  </>
  )
}

export default SectionHeader;