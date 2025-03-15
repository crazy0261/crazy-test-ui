import { batchModApiType } from '@/services/apiManagement';
import { Button, Form, message, Modal, Radio } from 'antd';
import { useState } from 'react';

const ModApiType = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      batchModApiType({ apiIds: props.apiIds, apiType: value.apiType }).then((result) => {
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
        title={'修改接口类型'}
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
        <Form form={form}>
          <Form.Item name="apiType" label="接口类型" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={'OUTER'}>外部接口</Radio>
              <Radio value={'INNER'}>内部接口</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModApiType;
