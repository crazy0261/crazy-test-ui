/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:49:51
 * @LastEditTime: 2025-04-06 20:13:45
 * @Description: 上架
 */
import { batchUpdateUpCase } from '@/services/processCase';
import { Form, Input, Modal, message } from 'antd';

const UpCase = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      batchUpdateUpCase({ caseIds: props.ids, remark: values.remark }).then((res) => {
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
          <TextArea rows={4} maxLength={255} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpCase;
