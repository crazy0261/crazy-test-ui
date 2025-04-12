/*
 * @Author: Menghui
 * @Date: 2025-03-13 23:04:44
 * @LastEditTime: 2025-04-12 13:00:36
 * @Description:
 */
import { batchDelete } from '@/services/api';
import { Button, Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

const BatchDeleteApi = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const { TextArea } = Input;

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      batchDelete({ apiIds: props.apiIds, remark: value.remark }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success(result.data);
          props.setIsModalOpen(false);
          props.actionRef.current.reload();
          form.resetFields();
          props.clearSelectedCaseIds();
        }
      });
    });
  };

  const handleCancel = () => {
    setIsloading(false);
    props.setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={'批量删除'}
        width="500px"
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
        <Form form={form} layout="vertical">
          <Form.Item name="remark" label="删除原因" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default BatchDeleteApi;
