import { add, modify } from '@/services/testAccountManagement';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const AddOrUpdateTestAccountManagement = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.record === null
        ? add(value).then((result) => showResult(result, '新建'))
        : modify({ ...value, id: props.record.id }).then((result) => showResult(result, '修改'));
    });
  };

  const showResult = (result, msg) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(msg + '成功！');
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.isModalOpen &&
      form.setFieldsValue({
        name: props.record?.name,
        account: props.record?.account,
        // password: props.record?.password,
        loginPath: props.record?.loginPath,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建测试账号' : '编辑测试账号'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        //删去了form表单自带的submit，在modal的footer自行渲染了一个button，点击后回调onFinish函数
        footer={[
          <>
            {/* {contextHolder} */}
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
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="account" label="账号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: props.record === null ? true : false }]}
          >
            <Input.Password placeholder={props.record === null ? '请输入密码' : '重置密码'} />
          </Form.Item>
          <Form.Item name="loginPath" label="登录地址" rules={[{ required: true }]}>
            <Input placeholder="http://***" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddOrUpdateTestAccountManagement;
