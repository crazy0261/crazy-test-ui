/*
 * @Author: Menghui
 * @Date: 2025-03-13 23:06:21
 * @LastEditTime: 2025-03-30 21:41:39
 * @Description: 移动接口应用
 */
import { batchMove } from '@/services/api';
import { listAll } from '@/services/application';
import { Button, Form, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const MoveApi = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [appEnum, setAppEnum] = useState([]);

  useEffect(() => {
    applicationList();
  }, []);
  const applicationList = () => {
    listAll().then((result) => {
      if (result.code === 200) {
        const appEnumData = result.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setAppEnum(appEnumData);
      }
    });
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      batchMove({ ...value, apiIds: props.selectedCaseIds.join() }).then((result) =>
        showResult(result),
      );
    });
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(result.message);
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
              options={appEnum}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default MoveApi;
