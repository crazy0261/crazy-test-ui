import { importApiByJson } from '@/services/api';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useState } from 'react';
/**
 * 导入接口
 */
const ImportApiByJson = (props) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      importApiByJson({ ...value }).then((res) => {
        if (res.code === 200) {
          message.success('导入成功');
          props.actionRef.current.reload();
          props.setIsModalOpen(false);
        }
        setIsloading(false);
      });
    });
  };

  return (
    <>
      <Modal
        title="导入接口"
        open={props.isModalOpen}
        onCancel={handleCancel}
        //删去了form表单自带的submit，在modal的footer自行渲染了一个button，点击后回调onFinish函数
        footer={[
          <>
            {/* {contextHolder} */}
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
          <Form.Item name="applicationId" label="应用" rules={[{ required: true }]}>
            <Select
              key="searchSelcet"
              showSearch
              allowClear
              placeholder="请输入关键字搜索"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={props.appEnum}
            />
          </Form.Item>

          <Form.Item name="json" label="json" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="appPath" label="应用路径" rules={[{ required: false }]}>
            <Input placeholder="会在接口前统一加上应用路径，比如：/prod-order" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ImportApiByJson;
