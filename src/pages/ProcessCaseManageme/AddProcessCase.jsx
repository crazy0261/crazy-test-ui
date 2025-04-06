/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:48:53
 * @LastEditTime: 2025-04-06 17:42:46
 * @Description: 添加场景用例
 */
import { priorityList } from '@/common';
import { save } from '@/services/processCase';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';
/**
 * 新建弹框
 */
const AddProcessCase = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (props.isModalOpen) {
      form.setFieldsValue({
        treeNodeName: props.selectedNodeName,
      });
    }
  }, [props.isModalOpen]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      save({ ...value, treeKey: props.selectedKeys }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success('新建用例成功！');
          props.actionRef.current.reload();
          props.setIsModalOpen(false);
          form.resetFields();
          // window.open('/mulTestCase/detail?id=' + result.data);
        }
      });
    });
  };

  return (
    <>
      <Modal
        title={'新建场景用例'}
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
          }}
          form={form}
        >
          <Form.Item name="treeNodeName" label="当前节点">
            <Input disabled />
          </Form.Item>
          <Form.Item name="name" label="用例名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Select key="priority" options={priorityList} />
          </Form.Item>
          <Form.Item
            name="isSubProcess"
            label="子流程"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <Select
              key="priority"
              options={[
                {
                  value: 1,
                  label: '是',
                },
                {
                  value: 0,
                  label: '否',
                },
              ]}
            />
          </Form.Item>
        </Form>
        <Form.Item name="priority" label="" rules={[{ required: false }]}>
          备注：子流程是指无法单独执行，或单独执行无意义的流程，仅用于给其他流程调用
        </Form.Item>
      </Modal>
    </>
  );
};

export default AddProcessCase;
