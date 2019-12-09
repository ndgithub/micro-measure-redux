import { Modal, Form, Input } from 'antd';
import React from 'react';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onSend, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Send Feedback"
          okText="Send"
          onCancel={onCancel}
          onOk={onSend}
        >
          <Form layout="vertical">

            <Form.Item label="Email (optional)">
              {getFieldDecorator('email')(<Input />)}
            </Form.Item>

            <Form.Item type="textarea" label="Feedback / Comments / Suggestions">
              {getFieldDecorator('feedback', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(<Input type="textarea" />)}
            </Form.Item>

          </Form>
        </Modal>
      );
    }
  },
);


export default CollectionCreateForm;