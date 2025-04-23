/*
 * @Author: Menghui
 * @Date: 2025-03-31 11:39:49
 * @LastEditTime: 2025-04-23 15:25:37
 * @Description:
 */
import { batchOwner } from '@/services/api';
import { Form, message, Modal, Select } from 'antd';

const EditOwnerApi = (props) => {
  const [form] = Form.useForm();

  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      batchOwner({ apiIds: props.apiIds, ownerId: values.ownerId }).then((res) => {
        if (res.code === 200) {
          message.success('更改成功');
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
      title="更改负责人"
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={(values) => handleOk(values)}
    >
      <Form form={form}>
        <Form.Item name="ownerId" label="负责人" rules={[{ required: true }]}>
          <Select placeholder="请选择负责人" options={props.ownerEnum}></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditOwnerApi;
