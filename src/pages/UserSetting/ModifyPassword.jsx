import { modifyPassword } from '@/services/ant-design-pro/api.ts';
import { history } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';

const ModifyPassword = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      modifyPassword({ ...value }).then((res) => {
        setIsloading(false);
        if (res.code === 200) {
          message.success('修改成功');
          form.resetFields();
          localStorage.removeItem('token');
          history.push('/user/login');
        }
      });
    });
  };

  return (
    <div>
      <Form
        style={{
          maxWidth: 500,
        }}
        form={form}
      >
        <Form.Item name="oldPassword" label="原始密码" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]} hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm password"
          label="确认密码"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入密码不一致，请重新输入'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button type="primary" onClick={onFinish} isloading={isloading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ModifyPassword;
