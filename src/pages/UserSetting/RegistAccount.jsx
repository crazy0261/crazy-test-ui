import { register } from '@/services/ant-design-pro/api';
import { Button, Form, Input, message, Select } from 'antd';
import React from 'react';

/**
 * 用户注册
 */
const RegistAccount = () => {
  const form = React.createRef();
  const onFinish = () => {
    form.current.validateFields().then((value) => {
      register(value).then((result) => {
        if (result.code === 200) {
          message.success(result.data);
        }
      });
    });
  };
  return (
    <>
      <Form
        name="register"
        style={{
          maxWidth: 600,
        }}
        ref={form}
      >
        <Form.Item name="tenantId" label="租户" rules={[{ required: true }]} initialValue={'YYHL'}>
          <Select defaultValue={'YYHL'}>
            <Select.Option value="YYHL">易易互联</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* <Form.Item name="account" label="账号" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}

        <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* <Form.Item name="password" label="密码" rules={[{ required: true }]} initialValue={"123456"}>
          <Input defaultValue={"123456"}/>
        </Form.Item> */}

        <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button type="primary" onClick={onFinish}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegistAccount;
