import { priorityList } from '@/pages/Common/utils';
import { add, modify } from '@/services/apiManage';
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';
/**
 * 新建弹框
 */
const AddApi = (props) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [curMethod, setCurMethod] = useState();

  const method = [
    {
      value: 'POST',
      label: 'POST',
    },
    {
      value: 'GET',
      label: 'GET',
    },
    {
      value: 'PUT',
      label: 'PUT',
    },
    {
      value: 'DELETE',
      label: 'DELETE',
    },
  ];
  const handleCancel = () => {
    props.setIsModalOpen(false);
    props.setRecord(null);
  };
  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.addApiOperType === 'add'
        ? add(value).then((result) => showResult(result, '新建'))
        : modify({ ...value, id: props.record.id }).then((result) => showResult(result, '修改'));
    });
  };

  const showResult = (result, operType) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(operType + '接口成功！');
      props.actionRef.current.reload();
      props.setRecord(null);
      props.setIsModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.isModalOpen &&
      form.setFieldsValue({
        applicationId: props?.record?.applicationId,
        name: props?.record?.name,
        method: props?.record?.method,
        path: props?.record?.path,
        contentType: props?.record?.contentType,
        priority: props?.record?.priority,
        timeOut: props?.record?.timeOut,
        owner: props?.record?.owner,
        requestParams: props?.record?.requestParams,
        apiType: props?.record?.apiType,
      });
    setCurMethod(props?.record?.method);
    jsonFormate();
  }, [props.isModalOpen]);

  const jsonFormate = () => {
    const requestParams = form.getFieldValue('requestParams');
    if (requestParams !== undefined && requestParams !== null) {
      try {
        let data = '';
        data = JSONbig.parse(requestParams);
        form.setFieldsValue({
          requestParams: JSON.stringify(data, null, 4),
        });
      } catch (e) {
        message.error('格式有误');
      }
    }
  };

  return (
    <>
      <Modal
        title={props.addApiOperType === 'add' ? '新建接口' : '编辑接口'}
        width="600px"
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

          <Form.Item name="name" label="接口名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="method" label="方法" rules={[{ required: true }]}>
            <Select
              options={method}
              onChange={(e) => {
                setCurMethod(e);
              }}
            />
          </Form.Item>

          <Form.Item name="path" label="路径" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="contentType"
            label="参数类型"
            rules={[{ required: curMethod !== 'GET' }]}
            hidden={curMethod === 'GET'}
          >
            <Radio.Group>
              <Radio value={'application/json'}>json</Radio>
              <Radio value={'multipart/form-data'}>form-data</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="apiType" label="接口类型" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={'OUTER'}>外部接口</Radio>
              <Radio value={'INNER'}>内部接口</Radio>
            </Radio.Group>
          </Form.Item>

          <Button
            style={{ float: 'right', marginLeft: 5 }}
            size="small"
            type="primary"
            onClick={() => jsonFormate()}
          >
            格式化
          </Button>

          <Form.Item name="requestParams" label="请求参数">
            <TextArea rows={8} placeholder={'请输入JSON格式的请求参数'} style={{ width: 1000 }} />
          </Form.Item>

          <Form.Item name="timeOut" label="超时时间（秒）">
            <InputNumber min={1} max={300} placeholder={10} />
          </Form.Item>

          <Form.Item name="priority" label="优先级">
            <Select key="priority" options={priorityList} />
          </Form.Item>

          <Form.Item name="owner" label="负责人">
            <Select
              key="owner"
              allowClear
              showSearch
              placeholder="请输入关键字搜索"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={props.ownerEnum}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddApi;
