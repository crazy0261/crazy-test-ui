import { queryByPoject, updateNode } from '@/services/tree';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 修改树节点
 */
const UpdateNode = (props) => {
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
    form.validateFields().then((value) => {
      setIsloading(true);
      updateNode({ ...value, currentKey: props.selectedKeys }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success('修改成功！');
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
        title={'编辑节点'}
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
          <Form.Item name="newNodeTitle" label="节点名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateNode;
