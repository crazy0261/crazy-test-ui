import { save, testConnect } from '@/services/dataSource';
import { Button, Form, Input, message, Modal, Tabs } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const EditDataSource = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [curEnv, setCurEnv] = useState('1');
  const [testConnectLoading, setTestConnectLoading] = useState(false);

  const handleTestConnect = () => {
    let driverClass;
    let jdbcUrl;
    let username;
    let password;
    if (curEnv === '1') {
      driverClass = form.getFieldValue('driver_class_test');
      jdbcUrl = form.getFieldValue('jdbc_url_test');
      username = form.getFieldValue('username_test');
      password = form.getFieldValue('password_test');
    } else if (curEnv === '2') {
      driverClass = form.getFieldValue('driver_class_demo');
      jdbcUrl = form.getFieldValue('jdbc_url_demo');
      username = form.getFieldValue('username_demo');
      password = form.getFieldValue('password_demo');
    } else if (curEnv === '3') {
      driverClass = form.getFieldValue('driver_class_prod');
      jdbcUrl = form.getFieldValue('jdbc_url_prod');
      username = form.getFieldValue('username_prod');
      password = form.getFieldValue('password_prod');
    } else {
      message.error('请选择环境！curEnv=' + curEnv);
    }

    setTestConnectLoading(true);
    testConnect({
      driverClass: driverClass,
      jdbcUrl: jdbcUrl,
      username: username,
      password: password,
    }).then((res) => {
      setTestConnectLoading(false);
      if (res.code === 200) {
        message.success('连接成功！');
      }
    });
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
    props.setRecord(null);
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      let config = genConfig(value);
      props.record === null
        ? save({ name: value?.name, config: config }).then((result) => showResult(result))
        : save({ name: value?.name, config: config, id: props.record.id }).then((result) =>
            showResult(result),
          );
    });
  };

  // 生成JSON格式的加密参数
  const genConfig = (value) => {
    let config = {};
    let configTest = {};
    config['1'] = configTest;
    configTest['driver_class'] = value?.driver_class_test;
    configTest['jdbc_url'] = value?.jdbc_url_test;
    configTest['username'] = value?.username_test;
    configTest['password'] = value?.password_test;
    configTest['min_pool_size'] = value?.min_pool_size_test;
    configTest['max_pool_size'] = value?.max_pool_size_test;
    configTest['max_idle_time'] = value?.max_idle_time_test;
    configTest['idle_connection_test_period'] = value?.idle_connection_test_period_test;

    let configInDemo = {};
    config['2'] = configInDemo;
    configInDemo['driver_class'] = value?.driver_class_demo;
    configInDemo['jdbc_url'] = value?.jdbc_url_demo;
    configInDemo['username'] = value?.username_demo;
    configInDemo['password'] = value?.password_demo;
    configInDemo['min_pool_size'] = value?.min_pool_size_demo;
    configInDemo['max_pool_size'] = value?.max_pool_size_demo;
    configInDemo['max_idle_time'] = value?.max_idle_time_demo;
    configInDemo['idle_connection_test_period'] = value?.idle_connection_test_period_demo;

    let configInProd = {};
    config['3'] = configInProd;
    configInProd['driver_class'] = value?.driver_class_prod;
    configInProd['jdbc_url'] = value?.jdbc_url_prod;
    configInProd['username'] = value?.username_prod;
    configInProd['password'] = value?.password_prod;
    configInProd['min_pool_size'] = value?.min_pool_size_prod;
    configInProd['max_pool_size'] = value?.max_pool_size_prod;
    configInProd['max_idle_time'] = value?.max_idle_time_prod;
    configInProd['idle_connection_test_period'] = value?.idle_connection_test_period_prod;

    return JSON.stringify(config);
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success('新建成功！');
      form.resetFields();
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      props.setRecord(null);
      form.resetFields();
    }
  };

  useEffect(() => {
    if (props.isModalOpen && props.record !== null) {
      let config = JSONbig.parse(props.record.config);
      form.setFieldsValue({
        name: props.record.name,
        driver_class_test: config['1'].driver_class,
        jdbc_url_test: config['1'].jdbc_url,
        username_test: config['1'].username,
        password_test: config['1'].password,
        min_pool_size_test: config['1'].min_pool_size,
        max_pool_size_test: config['1'].max_pool_size,
        max_idle_time_test: config['1'].max_idle_time,
        idle_connection_test_period_test: config['1'].idle_connection_test_period,

        driver_class_demo: config['2'].driver_class,
        jdbc_url_demo: config['2'].jdbc_url,
        username_demo: config['2'].username,
        password_demo: config['2'].password,
        min_pool_size_demo: config['2'].min_pool_size,
        max_pool_size_demo: config['2'].max_pool_size,
        max_idle_time_demo: config['2'].max_idle_time,
        idle_connection_test_period_demo: config['2'].idle_connection_test_period,

        driver_class_prod: config['3'].driver_class,
        jdbc_url_prod: config['3'].jdbc_url,
        username_prod: config['3'].username,
        password_prod: config['3'].password,
        min_pool_size_prod: config['3'].min_pool_size,
        max_pool_size_prod: config['3'].max_pool_size,
        max_idle_time_prod: config['3'].max_idle_time,
        idle_connection_test_period_prod: config['3'].idle_connection_test_period,
      });
    }
    if (!props.isModalOpen) {
      setTestConnectLoading(false);
    }
  }, [props.isModalOpen]);

  const items = [
    {
      key: '1',
      label: 'TEST 环境',
    },
    {
      key: '2',
      label: 'DEMO 环境',
    },
    {
      key: '3',
      label: 'PROD 环境',
    },
  ];

  const onChangeEnv = (key) => {
    setCurEnv(key);
  };

  return (
    <>
      <Modal
        title={props.record === null ? '新增数据源' : '编辑数据源'}
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
            maxWidth: 600,
          }}
          form={form}
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Tabs defaultActiveKey="1" items={items} onChange={onChangeEnv} />

          <Form.Item
            name="driver_class_test"
            label="driver_class"
            rules={[{ required: true }]}
            hidden={curEnv !== '1'}
          >
            <Input placeholder="com.mysql.cj.jdbc.Driver" />
          </Form.Item>
          <Form.Item
            name="jdbc_url_test"
            label="jdbc_url"
            rules={[{ required: true }]}
            hidden={curEnv !== '1'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username_test"
            label="username"
            rules={[{ required: true }]}
            hidden={curEnv !== '1'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password_test"
            label="password"
            rules={[{ required: true }]}
            hidden={curEnv !== '1'}
          >
            <Input />
          </Form.Item>
          <Form.Item name="min_pool_size_test" label="min_pool_size" hidden={curEnv !== '1'}>
            <Input placeholder="1" />
          </Form.Item>
          <Form.Item name="max_pool_size_test" label="max_pool_size" hidden={curEnv !== '1'}>
            <Input placeholder="2" />
          </Form.Item>
          <Form.Item name="max_idle_time_test" label="max_idle_time" hidden={curEnv !== '1'}>
            <Input placeholder="20000" />
          </Form.Item>
          <Form.Item
            name="idle_connection_test_period_test"
            label="idle_connection_test_period"
            hidden={curEnv !== '1'}
          >
            <Input placeholder="3600" />
          </Form.Item>

          <Form.Item
            name="driver_class_demo"
            label="driver_class"
            rules={[{ required: true }]}
            hidden={curEnv !== '2'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jdbc_url_demo"
            label="jdbc_url"
            rules={[{ required: true }]}
            hidden={curEnv !== '2'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username_demo"
            label="username"
            rules={[{ required: true }]}
            hidden={curEnv !== '2'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password_demo"
            label="password"
            rules={[{ required: true }]}
            hidden={curEnv !== '2'}
          >
            <Input />
          </Form.Item>
          <Form.Item name="min_pool_size_demo" label="min_pool_size" hidden={curEnv !== '2'}>
            <Input placeholder="1" />
          </Form.Item>
          <Form.Item name="max_pool_size_demo" label="max_pool_size" hidden={curEnv !== '2'}>
            <Input placeholder="2" />
          </Form.Item>
          <Form.Item name="max_idle_time_demo" label="max_idle_time" hidden={curEnv !== '2'}>
            <Input placeholder="20000" />
          </Form.Item>
          <Form.Item
            name="idle_connection_test_period_demo"
            label="idle_connection_test_period"
            hidden={curEnv !== '2'}
          >
            <Input placeholder="3600" />
          </Form.Item>

          <Form.Item name="driver_class_prod" label="driver_class" hidden={curEnv !== '3'}>
            <Input />
          </Form.Item>
          <Form.Item name="jdbc_url_prod" label="jdbc_url" hidden={curEnv !== '3'}>
            <Input />
          </Form.Item>
          <Form.Item name="username_prod" label="username" hidden={curEnv !== '3'}>
            <Input />
          </Form.Item>
          <Form.Item name="password_prod" label="password" hidden={curEnv !== '3'}>
            <Input />
          </Form.Item>
          <Form.Item name="min_pool_size_prod" label="min_pool_size" hidden={curEnv !== '3'}>
            <Input placeholder="1" />
          </Form.Item>
          <Form.Item name="max_pool_size_prod" label="max_pool_size" hidden={curEnv !== '3'}>
            <Input placeholder="2" />
          </Form.Item>
          <Form.Item name="max_idle_time_prod" label="max_idle_time" hidden={curEnv !== '3'}>
            <Input placeholder="20000" />
          </Form.Item>
          <Form.Item
            name="idle_connection_test_period_prod"
            label="idle_connection_test_period"
            hidden={curEnv !== '3'}
          >
            <Input placeholder="3600" />
          </Form.Item>
          <Button
            type="primary"
            size="small"
            onClick={handleTestConnect}
            loading={testConnectLoading}
          >
            测试链接
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditDataSource;
