/*
 * @Author: Menghui
 * @Date: 2025-03-30 14:59:31
 * @LastEditTime: 2025-03-30 16:14:03
 * @Description:
 */
import { save } from '@/services/user';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const EditUser = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.record === null
        ? save(value).then((result) => showResult(result, '新建'))
        : save({ ...value, id: props.record.id }).then((result) => showResult(result, '修改'));
    });
  };

  const showResult = (result, msg) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(msg + '成功！');
      props.actionRef.current.reload();
      props.setModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.modalOpen &&
      form.setFieldsValue({
        account: props.record?.account,
        name: props.record?.name,
        phone: props.record?.phone,
        email: props.record?.email,
        roleId: props.record?.roleId,
      });
  }, [props.modalOpen, props.record]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建账号' : '编辑账号'}
        open={props.modalOpen}
        onCancel={handleCancel}
        footer={[
          <>
            <Button type="primary" onClick={handleCancel} key={'cancel'}>
              取消
            </Button>
            <Button type="primary" onClick={onFinish} key={'submit'} loading={isloading}>
              提交
            </Button>
          </>,
        ]}
      >
        <Form
          style={{
            maxWidth: 800,
          }}
          form={form}
        >
          <Form.Item name="account" label="账号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 1, label: '管理员' },
                { value: 0, label: '质量员' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditUser;
