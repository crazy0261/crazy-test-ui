import { listAll } from '@/services/applicationManagement';
import { save } from '@/services/encrypt';
import { envAppList } from '@/services/envConfig';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const EditEncrypt = (props) => {
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [appEnum, setAppEnum] = useState([]);
  const [env, setEnv] = useState([]);

  const handleCancel = () => {
    props.setIsModalOpen(false);
    props.setRecord(null);
    form.resetFields();
  };

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

  const appIdListData = (value) => {
    envAppList({ appId: value }).then((result) => {
      if (result.code === 200) {
        const envData = result.data.map((item) => {
          return {
            value: item.envId,
            label: item.envName,
          };
        });
        setEnv(envData);
      }
    });
  };

  useEffect(() => {
    if (props.isModalOpen === true && props.record !== null) {
      appIdListData(props.record.appId);
    }

    if (props.isModalOpen === true && props.record === null) {
      setEnv([]);
    }
  }, [props.isModalOpen]);

  const onFinish = () => {
    form.validateFields().then((values) => {
      setIsloading(true);
      const secretParam = env.map((envItem) => {
        const envId = envItem.value;
        return {
          id: envId,
          api_key: values[`api_key_${envId}`], // 获取 api_key
          api_secret: values[`api_secret_${envId}`], // 获取 api_secret
        };
      });

      props.record === null
        ? save({ name: values?.name, encryptJson: secretParam, appId: values.appId }).then(
            (result) => showResult(result),
          )
        : save({
            name: values?.name,
            encryptJson: secretParam,
            appId: values.appId,
            id: props.record.id,
          }).then((result) => showResult(result));
    });
  };

  const showResult = (result) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(props.record === null ? '新建成功！' : `编辑成功！`);
      form.resetFields();
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      props.setRecord(null);
      form.resetFields();
    }
  };

  useEffect(() => {
    appData();

    if (props.isModalOpen && props.record !== null) {
      let secretParam = JSON.parse(props.record.encryptJson);

      const formInitialValues = {
        name: props.record.name,
        appId: props.record.appId,
      };

      secretParam.forEach((element) => {
        formInitialValues[`api_key_${element.id}`] = element.api_key;
        formInitialValues[`api_secret_${element.id}`] = element.api_secret;
      });
      form.setFieldsValue(formInitialValues);
    }
  }, [props.isModalOpen, props.record?.appId]);

  return (
    <>
      <Modal
        title={props.record === null ? '新建加密参数' : '编辑加密参数'}
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

          {/* 动态渲染环境表单项 */}
          {env.map((envItem) => {
            const envLabel = envItem.label;
            return (
              <div key={envItem.value}>
                <b>{envLabel}环境：</b>
                <Form.Item name={`api_key_${envItem.value}`} label="api_key">
                  <Input />
                </Form.Item>
                <Form.Item name={`api_secret_${envItem.value}`} label="api_secret">
                  <Input />
                </Form.Item>
              </div>
            );
          })}
        </Form>
      </Modal>
    </>
  );
};

export default EditEncrypt;
