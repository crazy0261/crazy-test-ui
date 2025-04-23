/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:49:28
 * @LastEditTime: 2025-04-06 20:49:05
 * @Description:删除场景用例
 */
import { del } from '@/services/processCase';
import { Form, Input, Modal, message } from 'antd';
import { useState } from 'react';

const DeleteCase = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = (values) => {
    form.validateFields().then((values) => {
      // form.resetFields();
      setIsLoading(true);
      del({ id: props.curCaseId, remark: values.remark }).then((res) => {
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
          <TextArea rows={4} showCount maxLength={255} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DeleteCase;
