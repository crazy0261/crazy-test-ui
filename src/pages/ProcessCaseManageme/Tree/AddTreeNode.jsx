/*
 * @Author: Menghui
 * @Date: 2025-04-05 14:51:56
 * @LastEditTime: 2025-04-05 19:56:49
 * @Description: 新增节点
 */
import { addNode, queryByPoject } from '@/services/tree';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建树节点
 */
const AddTreeNode = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (props.isModalOpen) {
      form.setFieldsValue({
        parentNodeName: props.parentNodeName,
      });
    }
  }, [props.isModalOpen]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      addNode({ ...value, currentKey: props.selectedKeys }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success('新增成功！');
          queryByPoject().then((res) => {
            props.setTreeData(res.data.treeList);
          });
          props.setIsModalOpen(false);
          form.resetFields();
        }
      });
    });
  };

  return (
    <>
      <Modal
        title={'新建节点'}
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
          <Form.Item name="newNodeTitle" label="新节点名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddTreeNode;
