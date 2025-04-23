import { modify } from '@/services/ant-design-pro/api.ts';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

const ModifyUserInfo = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [form] = Form.useForm();
  const [formDisabled, setFormDisabled] = useState(true);

  const onFinish = (values) => {
    if (formDisabled) {
      setFormDisabled(false);
    } else {
      setFormDisabled(true);
      modify(values).then((res) => {
        if (res.code === 200) {
          message.success('修改成功');
        }
      });
    }
  };

  const handleOk = () => {
    props.onClose(false);
  };

  const onOkFormDisabled = () => {
    setFormDisabled(false);
  };

  return (
    <div>
      <Modal
        title="用户信息"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={handleOk}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {formDisabled && (
              <Button type="dashed" onClick={onOkFormDisabled}>
                修改用户信息
              </Button>
            )}
            <CancelBtn />
            <OkBtn htmlType="submit" />
          </>
        )}
      >
        <Form
          form={form}
          name="basic"
          style={{
            maxWidth: 500,
          }}
          onFinish={onFinish}
          initialValues={{
            name: currentUser?.name,
            account: currentUser?.account,
            phone: currentUser?.phone,
          }}
        >
          <Form.Item label="用户名" name="name" rules={[{ required: true }]}>
            <Input disabled={formDisabled} />
          </Form.Item>

          <Form.Item label="账号" name="account" rules={[{ required: true }]}>
            <Input disabled={formDisabled} />
          </Form.Item>

          <Form.Item label="手机号" name="phone" rules={[{ required: false }]}>
            <Input disabled={formDisabled} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          ></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModifyUserInfo;
