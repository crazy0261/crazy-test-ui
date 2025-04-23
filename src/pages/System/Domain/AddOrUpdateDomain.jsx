import { save } from '@/services/domain';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const AddOrUpdateDomain = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setIsModalOpen(false);
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
      props.setIsModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.isModalOpen &&
      form.setFieldsValue({
        name: props.record?.name,
        urlPath: props.record?.urlPath,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建域名' : '编辑域名'}
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
          // {...formItemLayout}
          style={{
            maxWidth: 800,
          }}
          form={form}
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入域名名称" />
          </Form.Item>
          <Form.Item name="urlPath" label="域名地址" rules={[{ required: true }]}>
            <Input placeholder="例如：http://hd-test-admin.com，或者http://127.0.0.1:8090" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddOrUpdateDomain;
