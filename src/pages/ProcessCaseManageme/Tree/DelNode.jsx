/*
 * @Author: Menghui
 * @Date: 2025-04-05 14:52:44
 * @LastEditTime: 2025-04-06 00:14:43
 * @Description: 删除数节点
 */
import { deleteNode, queryByPoject } from '@/services/tree';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 删除节点
 */
const DelNode = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (props.isModalOpen) {
      form.setFieldsValue({
        newNodeTitle: props.selectedNodeName,
      });
    }
  }, [props.isModalOpen]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    try {
      form.validateFields().then((value) => {
        setIsloading(true);
        deleteNode({ currentKey: props.selectedKeys }).then((result) => {
          if (result.code === 200) {
            message.success('删除成功！');
            queryByPoject().then((res) => {
              props.setTreeData(res.data.treeList);
            });
            setIsloading(false);
            props.setIsModalOpen(false);
            form.resetFields();
          }
        });
      });
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <Modal
        title={'确定要删除节点？'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        footer={[
          <>
            <Button type="primary" onClick={handleCancel} key={'cancel'}>
              取消
            </Button>
            <Button type="primary" onClick={onFinish} key={'submit'} loading={isloading}>
              确认
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
          <Form.Item name="newNodeTitle" label="节点名" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DelNode;
