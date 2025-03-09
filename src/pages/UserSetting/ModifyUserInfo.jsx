import { modify } from '@/services/ant-design-pro/api.ts';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';

const ModifyUserInfo = () => {
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

  return (
    <div>
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
        >
          <Button type="primary" htmlType="submit" size="small">
            {formDisabled ? '修改用户信息' : '提交'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ModifyUserInfo;
