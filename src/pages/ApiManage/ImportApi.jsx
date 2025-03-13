import { importApi, importByFetch } from '@/services/apiManage';
import { Button, Form, Input, message, Modal, Radio, Select } from 'antd';
import { useState } from 'react';
/**
 * 导入接口
 */
const ImportApi = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [importType, setImportType] = useState('fetch');
  const { TextArea } = Input;

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    try {
      form.validateFields().then((value) => {
        setIsloading(true);
        if (importType === 'swagger') {
          importApi({ ...value }).then((res) => handleApiResponse(res));
        } else if (importType === 'fetch') {
          importByFetch({ ...value }).then((res) => handleApiResponse(res));
        } else {
          message.error('不支持的导入类型：' + importType);
        }
      });
    } finally {
    }
  };

  const handleApiResponse = (res) => {
    if (res.code === 200) {
      message.success('导入成功');
      props.setIsModalOpen(false);
      props.actionRef.current.reload();
      form.resetFields();
    }
    setIsloading(false);
  };

  const changeImportType = (e) => {
    setImportType(e.target.value);
  };

  return (
    <>
      <Modal
        title="导入接口"
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
            maxWidth: 800,
          }}
          form={form}
        >
          <div style={{ marginBottom: 20 }}>
            <Radio.Group defaultValue={'fetch'} onChange={changeImportType}>
              <Radio value="fetch">通过fetch导入</Radio>
              <Radio value="swagger">通过swagger导入</Radio>
            </Radio.Group>
          </div>
          <Form.Item name="applicationId" label="应用" rules={[{ required: true }]}>
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

          {importType === 'swagger' && (
            <Form.Item name="url" label="URL" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}
          {importType === 'swagger' && (
            <Form.Item name="appPath" label="应用路径" rules={[{ required: false }]}>
              <Input placeholder="会在接口前统一加上应用路径，比如：/prod-order" />
            </Form.Item>
          )}
          {importType === 'fetch' && (
            <Form.Item name="apiName" label="接口名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}
          {importType === 'fetch' && (
            <Form.Item name="fetch" label="fetch" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ImportApi;
