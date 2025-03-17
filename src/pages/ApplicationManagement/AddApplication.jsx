import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { add, modify } from '@/services/applicationManagement';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const AddApplication = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const { TextArea } = Input;
  const [ownerEnum, setOwnerEnum] = useState([]);

  const handleCancel = () => {
    props.setRecord({});
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.record === null
        ? add(value).then((result) => showResult(result))
        : modify({ ...value, id: props.record.id }).then((result) => showResult(result));
    });
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success('新建应用成功！');
      form.resetFields();
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      props.setRecord(null);
      form.resetFields();
    }
  };

  const requestOwnerEnum = () => {
    listAllUser().then((result) => {
      if (result.code === 200) {
        let owners = [];
        result.data.map((item) => owners.push({ value: item.id, label: item.name }));
        console.log('owners=' + owners);
        setOwnerEnum(owners);
      }
    });
  };

  useEffect(() => {
    if (props.isModalOpen) {
      requestOwnerEnum();
      if (props.record !== null) {
        form.setFieldsValue({
          name: props.record.name,
          remark: props.record.remark,
          ownerId: props.record.ownerId,
        });
      }
    }
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建应用' : '编辑应用'}
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
        <Form
          style={{
            maxWidth: 600,
          }}
          form={form}
        >
          <Form.Item name="name" label="应用名" rules={[{ required: true }]}>
            <Input placeholder="注意：需要与云效流水线的名称一致" />
          </Form.Item>
          <Form.Item name="ownerId" label="负责人" rules={[{ required: true }]}>
            <Select
              key="owner"
              allowClear
              showSearch
              placeholder="请输入关键字搜索"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={ownerEnum}
            />
          </Form.Item>
          <Form.Item name="remark" label="应用描述">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddApplication;
