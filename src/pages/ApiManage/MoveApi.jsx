import { copy, move } from '@/services/apiManage';
import { Button, Form, message, Modal, Select } from 'antd';
import { useState } from 'react';

const MoveApi = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.moveOrCopy === 'move'
        ? move({ ...value, apiIds: props.selectedCaseIds.join() }).then((result) =>
            showResult(result),
          )
        : copy({ ...value, apiIds: props.selectedCaseIds.join() }).then((result) =>
            showResult(result),
          );
    });
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(result.data);
      props.setIsModalOpen(false);
      props.actionRef.current.reload();
      form.resetFields();
      props.clearSelectedCaseIds();
    }
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={props.moveOrCopy === 'move' ? '移动到' : '复制到'}
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
          <Form.Item name="appId" label="应用" rules={[{ required: true }]}>
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
        </Form>
      </Modal>
    </>
  );
};
export default MoveApi;
