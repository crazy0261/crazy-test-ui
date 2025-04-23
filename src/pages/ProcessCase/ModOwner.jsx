/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:50:16
 * @LastEditTime: 2025-04-06 17:43:51
 * @Description: 批量修改负责人
 */
import { batchUpdateOwner } from '@/services/processCase';
import { listAll as listAllUser } from '@/services/user';
import { Form, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';

const ModOwner = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [ownerEnum, setOwnerEnum] = useState([]);

  const handleOk = (values) => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      batchUpdateOwner({ caseIds: props.ids, ownerId: values.ownerId }).then((res) => {
        setIsLoading(false);
        if (res.code === 200) {
          message.success('修改成功');
          props.setOpen(false);
          props.actionRef.current.reload();
          props.clearSelectedCaseIds();
        }
      });
    });
  };

  const handleCancel = () => {
    props.setOpen(false);
  };

  const requestOwnerEnum = () => {
    listAllUser().then((result) => {
      if (result.code === 200) {
        const owners = result.data.map((item) => ({ value: item.id, label: item.name }));
        setOwnerEnum(owners);
      }
    });
  };

  useEffect(() => {
    requestOwnerEnum();
  }, []);

  return (
    <Modal
      open={props.open}
      title="修改负责人"
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={(values) => handleOk(values)}
      okButtonProps={{ loading: isLoading }}
    >
      <Form form={form}>
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
      </Form>
    </Modal>
  );
};
export default ModOwner;
