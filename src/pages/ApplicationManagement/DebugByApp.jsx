import { debugByApp } from '@/services/apiCase';
import { Button, Form, message, Modal, Radio } from 'antd';
import { useState } from 'react';
/**
 * 执行应用下全部接口用例
 */
const DebugByApp = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setIsModalOpen(false);
    props.setRecord(null);
  };
  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      debugByApp({ ...value, appId: props.record.id, delaySeconds: 0 }).then((res) => {
        setIsloading(false);
        if (res.code === 200) {
          message.success('执行成功');
          window.open('/schedule/result/0/' + res.data);
          props.setIsModalOpen(false);
        }
      });
    });
  };

  return (
    <>
      <Modal
        title="执行应用下全部接口用例"
        open={props.isModalOpen}
        onCancel={handleCancel}
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
            maxWidth: 600,
            marginTop: 30,
          }}
          form={form}
        >
          <Form.Item name="envNameId" label="环境" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={1}>测试环境</Radio>
              <Radio value={2}>demo环境</Radio>
              <Radio value={3}>生产环境</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DebugByApp;
