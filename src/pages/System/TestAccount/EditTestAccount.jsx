import { allList } from '@/services/apiCase';
import { save } from '@/services/testAccount';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const EditTestAccount = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isloading, setIsloading] = useState(false);
  const [apiCaseList, setApiCaseList] = useState([]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const checkJson = (value) => {
    try {
      JSONbig.parse(value);
      return true;
    } catch (error) {
      setIsloading(false);
      message.error('账号/密码不是JSON格式，请检查！');
      return false;
    }
  };
  const onFinish = () => {
    form.validateFields().then((value) => {
      const checkInputParams = checkJson(value?.inputParams);
      setIsloading(true);
      if (checkInputParams) {
        props.record === null
          ? save(value).then((result) => showResult(result, '新建'))
          : save({ ...value, id: props.record.id }).then((result) => showResult(result, '修改'));
      }
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
        envId: props.record?.envId,
        name: props.record?.name,
        inputParams: props.record?.inputParams,
        apiCaseId: props.record?.apiCaseId,
        headerParams: props.record?.headerParams,
        jsonPath: props.record?.jsonPath,
        cron: props.record?.cron,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建账号' : '编辑账号'}
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
            maxWidth: 800,
          }}
          form={form}
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="inputParams" label="账号/密码" rules={[{ required: true }]}>
            <TextArea
              showCount
              maxLength={255}
              placeholder='json格式{"account":"admin","pwd":"123456"}'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item name="cron" label="Cron表达式" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apiCaseId" label="关联用例" rules={[{ required: true }]}>
            <Select showSearch placeholder="请输入关键字搜索" options={apiCaseList} />
          </Form.Item>
          <Form.Item name="headerParams" label="请求头" rules={[{ required: false }]}>
            <TextArea maxLength={255} placeholder='{"content-type":"application/json"}' />
          </Form.Item>
          <Form.Item name="jsonPath" label="jsonPath" rules={[{ required: true }]}>
            <TextArea maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTestAccount;
