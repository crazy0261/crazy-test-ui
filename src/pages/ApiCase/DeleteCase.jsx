import { deleteApi } from '@/services/apiCase';
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

const DeleteCase = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isLoading, setIsLoading] = useState(false);
  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      setIsLoading(true);
      deleteApi({ id: props.curApiId, remark: values.remark }).then((res) => {
        setIsLoading(false);
        if (res.code === 200) {
          message.success('删除成功');
          props.setOpen(false);
          props.actionRef.current.reload();
        }
      });
    });
  };
  const handleCancel = () => {
    props.setOpen(false);
  };
  return (
    <Modal
      open={props.open}
      title="删除用例"
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={(values) => handleOk(values)}
      okButtonProps={{ loading: isLoading }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="remark" label="删除原因" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DeleteCase;
