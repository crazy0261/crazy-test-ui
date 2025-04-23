/*
 * @Author: Menghui
 * @Date: 2025-03-15 16:14:01
 * @LastEditTime: 2025-03-31 13:20:35
 * @Description:下架用例弹窗
 */
import { batchDown } from '@/services/apiCase';
import { Form, Input, message, Modal } from 'antd';

const DisableCase = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      batchDown({ ids: props.ids, remark: values.remark }).then((res) => {
        if (res.code === 200) {
          message.success('下架成功');
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
      title="下架用例"
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={(values) => handleOk(values)}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="remark" label="下架原因" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DisableCase;
