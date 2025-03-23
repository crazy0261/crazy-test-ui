import { allList } from '@/services/apiCase';
import { save } from '@/services/testAccountManagement';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const AddOrUpdateTestAccountManagement = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isloading, setIsloading] = useState(false);
  const [apiCaseList, setApiCaseList] = useState([]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.record === null
        ? save(value).then((result) => showResult(result, '新建'))
        : save({ ...value, id: props.record.id }).then((result) => showResult(result, '修改'));
    });
  };

  const apiCaseListData = async () => {
    const result = await allList();
    if (result.code === 200) {
      const data = result.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setApiCaseList(data);
    }
  };

  useEffect(() => {
    apiCaseListData();
  }, []);
  const showResult = (result, msg) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(msg + '成功！');
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.isModalOpen &&
      form.setFieldsValue({
        name: props.record?.name,
        account: props.record?.account,
        password: props.record?.password,
        apiCaseId: props.record?.apiCaseId,
        headerParams: props.record?.headerParams,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建测试账号' : '编辑测试账号'}
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
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="account" label="账号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: props.record === null ? true : false }]}
          >
            <Input.Password placeholder={props.record === null ? '请输入密码' : '重置密码'} />
          </Form.Item>
          <Form.Item name="apiCaseId" label="关联用例" rules={[{ required: true }]}>
            <Select showSearch placeholder="请输入关键字搜索" options={apiCaseList} />
          </Form.Item>

          <Form.Item name="headerParams" label="请求头" rules={[{ required: false }]}>
            <TextArea maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddOrUpdateTestAccountManagement;
