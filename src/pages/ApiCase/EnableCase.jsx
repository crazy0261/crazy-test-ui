import { enable } from '@/services/apiCase';
import { Form, Input, message, Modal } from 'antd';

const EnableCase = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      enable({ ids: props.ids, remark: values.remark }).then((res) => {
        if (res.code === 200) {
          message.success('上架成功');
          props.setOpen(false);
          props.actionRef.current.reload();
          props.clearSelectedCaseIds();
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
      title="上架用例"
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={(values) => handleOk(values)}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="remark" label="上架原因" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EnableCase;
