import { listAll } from '@/services/application';
import { save, testConnect } from '@/services/dataSource';
import { envAppList } from '@/services/envConfig';
import { Button, Form, Input, InputNumber, message, Modal, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

/**
 * 新建弹框
 */
const EditDataSource = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [curEnv, setCurEnv] = useState(null);
  const [testConnectLoading, setTestConnectLoading] = useState(false);
  const [appEnum, setAppEnum] = useState([]);
  const [env, setEnv] = useState([]);

  useEffect(() => {
    appData();
  }, []);

  useEffect(() => {
    if (props.isModalOpen === true && props.record !== null) {
      appIdListData(props.record.appId);
    }

    if (props.isModalOpen === true && props.record === null) {
      setEnv([]);
    }
  }, [props.isModalOpen]);

  const appData = () => {
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

  const handleTestConnect = () => {
    const fields = [
      'dbName',
      'jdbcUrl',
      'username',
      'password',
      'driverClass',
      'minPoolSize',
      'maxPoolSize',
      'maxIdleTime',
      'idleConnectionTestPeriod',
    ];

    const checkFields = ['dbName', 'jdbcUrl', 'username', 'password', 'driverClass'];

    const values = fields.reduce((acc, field) => {
      acc[field] = form.getFieldValue(`${field}_${curEnv}`);
      return acc;
    }, {});

    if (checkFields.some((field) => values[field] === undefined || values[field] === null)) {
      message.error('数据库名称、jdbcUrl、用户名、密码、driverClass不能为空！');
      return;
    }

    setTestConnectLoading(true);
    testConnect(values).then((res) => {
      setTestConnectLoading(false);
      if (res.code === 200) {
        message.success('连接成功！');
      }
    });
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
    props.setRecord(null);
    form.resetFields();
  };

  // 构建需要校验的字段列表
  const fieldsToValidate = [
    `dbName_${curEnv}`,
    `jdbcUrl_${curEnv}`,
    `username_${curEnv}`,
    `password_${curEnv}`,
    `driverClass_${curEnv}`,
    `minPoolSize_${curEnv}`,
    `maxPoolSize_${curEnv}`,
    `maxIdleTime_${curEnv}`,
    `idleConnectionTestPeriod_${curEnv}`,
  ];
  const onFinish = () => {
    form.validateFields(fieldsToValidate).then(() => {
      setIsloading(true);

      const allValues = form.getFieldsValue();
      const dataList = env.map(({ key: envId }) => {
        return {
          [envId]: {
            dbName: allValues[`dbName_${envId}`],
            jdbcUrl: allValues[`jdbcUrl_${envId}`],
            username: allValues[`username_${envId}`],
            password: allValues[`password_${envId}`],
            driverClass: allValues[`driverClass_${envId}`],
            minPoolSize: allValues[`minPoolSize_${envId}`],
            maxPoolSize: allValues[`maxPoolSize_${envId}`],
            maxIdleTime: allValues[`maxIdleTime_${envId}`],
            idleConnectionTestPeriod: allValues[`idleConnectionTestPeriod_${envId}`],
          },
        };
      });

      props.record === null
        ? save({
            name: allValues?.name,
            appId: allValues.appId,
            remark: allValues.remark,
            dataSourceJson: dataList,
          }).then((result) => showResult(result))
        : save({
            name: allValues?.name,
            appId: allValues.appId,
            dataSourceJson: dataList,
            id: props.record.id,
            remark: allValues?.remark,
          }).then((result) => showResult(result));
    });
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(props.record === null ? '新建成功！' : `编辑成功！`);
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      props.setRecord(null);
      form.resetFields();
    }
  };

  const appIdListData = (value) => {
    envAppList({ appId: value }).then((result) => {
      if (result.code === 200) {
        const envData = result.data.map((item) => {
          return {
            key: item.envId,
            label: item.envName,
          };
        });
        setEnv(envData);

        if (envData.length > 0) {
          setCurEnv(envData[0].key);
        }
      }
    });
  };

  useEffect(() => {
    if (props.isModalOpen && props.record !== null) {
      form.setFieldsValue({
        name: props.record.name,
        appId: props.record.appId,
        remark: props.record.remark,
      });

      const dataSourceJson = JSON.parse(props.record.dataSourceJson);
      // 设置表单字段值
      if (dataSourceJson && Array.isArray(dataSourceJson)) {
        dataSourceJson.forEach((item) => {
          const envId = Object.keys(item)[0]; // 获取环境 ID
          const dataSourceConfig = item[envId]; // 获取对应环境的配置
          // 设置每个环境对应的表单字段值
          Object.keys(dataSourceConfig).forEach((field) => {
            form.setFieldsValue({
              [`${field}_${envId}`]: dataSourceConfig[field],
            });
          });
        });
      }

      // 设置初始环境
      if (dataSourceJson && dataSourceJson.length > 0) {
        const firstEnvId = Object.keys(dataSourceJson[0])[0]; // 获取第一个环境的 ID
        setCurEnv(firstEnvId); // 设置当前环境为第一个环境的 ID
      }
    }

    if (!props.isModalOpen) {
      setTestConnectLoading(false);
    }
  }, [props.isModalOpen]);

  const onChangeEnv = (key) => {
    setCurEnv(key);
  };

  // 动态表单生成
  const renderFormItems = (envId) => {
    const fields = [
      {
        name: 'dbName',
        label: '数据库名称',
        placeholder: '请输入数据库名称',
        rules: [{ required: true }],
      },
      {
        name: 'jdbcUrl',
        label: 'jdbcUrl',
        placeholder: 'jdbc:mysql://120.220.10.11:3306',
        rules: [{ required: true }],
      },
      {
        name: 'username',
        label: '用户名',
        placeholder: '请输入用户名',
        rules: [{ required: true }],
      },
      { name: 'password', label: '密码', placeholder: '请输入密码', rules: [{ required: true }] },
      {
        name: 'driverClass',
        label: 'driverClass',
        placeholder: 'com.mysql.cj.jdbc.Driver',
        rules: [{ required: true }],
      },
      {
        name: 'minPoolSize',
        label: '最小连接池大小',
        placeholder: '1',
        rules: [{ pattern: /^\d+$/, message: '请输入正整数或 0' }],
      },
      {
        name: 'maxPoolSize',
        label: '最大连接池大小',
        placeholder: '2',
        rules: [{ pattern: /^\d+$/, message: '请输入正整数或 0' }],
      },
      {
        name: 'maxIdleTime',
        label: '最大空闲时间',
        placeholder: '20000',
        rules: [{ pattern: /^\d+$/, message: '请输入正整数或 0' }],
      },
      {
        name: 'idleConnectionTestPeriod',
        label: '空闲连接测试周期',
        placeholder: '3600',
        rules: [],
      },
    ];
    return fields.map(({ name, label, placeholder, rules }) => (
      <Form.Item key={name} name={`${name}_${envId}`} label={label} rules={rules}>
        {['minPoolSize', 'maxPoolSize', 'maxIdleTime', 'idleConnectionTestPeriod'].includes(
          name,
        ) ? (
          <InputNumber placeholder={placeholder} style={{ width: '100%' }} min={0} />
        ) : (
          <Input placeholder={placeholder} />
        )}
      </Form.Item>
    ));
  };

  return (
    <>
      <Modal
        title={props.record === null ? '新增数据源' : '编辑数据源'}
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
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="appId" label="应用" rules={[{ required: true }]}>
            <Select
              showSearch
              options={appEnum}
              width={260}
              name="appId"
              label="应用"
              rules={[{ required: true }]}
              onChange={appIdListData}
            />
          </Form.Item>

          {env.length > 0 && (
            <Tabs
              defaultActiveKey={curEnv}
              items={env.map((item) => ({
                key: item.key,
                label: item.label,
                children: renderFormItems(item.key),
              }))}
              onChange={onChangeEnv}
            />
          )}
          <Form.Item name="remark" label="备注" rules={[{ required: false }]}>
            <TextArea showCount maxLength={255} autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>

          <Button
            type="primary"
            size="small"
            disabled={curEnv === null ? true : false}
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
