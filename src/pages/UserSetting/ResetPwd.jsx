import { resetPassword } from '@/services/ant-design-pro/api';
import { Button, Form, Input, message, Select } from 'antd';
import React from 'react';

/**
 * 重置密码
 */
const ResetPwd = () => {
  const form = React.createRef();
  const onFinish = () => {
    form.current.validateFields().then((value) => {
      resetPassword(value).then((result) => {
        if (result.code === 200) {
          message.success(result.data);
        }
      });
    });
  };
  return (
    <>
      <p>注意：仅管理员有权限</p>
      <Form
        name="ResetPwd"
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

        <Form.Item name="account" label="账号" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button type="primary" onClick={onFinish}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPwd;
