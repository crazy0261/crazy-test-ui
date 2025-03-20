import { save } from '@/services/projectManagement';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const AddOrEditProject = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const { TextArea } = Input;

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
      props.record !== null &&
      form.setFieldsValue({
        name: props.record?.name,
        remark: props.record?.remark,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建项目' : '编辑项目'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        //删去了form表单自带的submit，在modal的footer自行渲染了一个button，点击后回调onFinish函数
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
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea showCount autoSize maxLength={255} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddOrEditProject;
