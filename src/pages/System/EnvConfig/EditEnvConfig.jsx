import SetReqHeader from '@/pages/ApiCase/ApiCaseDetail/ReqHeader';
import { list } from '@/services/applicationManagement';
import { listPage as domainlist } from '@/services/domain';
import { queryById, save } from '@/services/envConfig';
import { ProCard, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

/**
 * 新建弹框
 */
const EditEnvConfig = (props) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const [isloading, setIsloading] = useState(false);
  const [reqHeaderArray, setReqHeaderArray] = useState([]);
  const [envVarArray, setEnvVarArray] = useState([]);
  const [appList, setAppList] = useState([]);
  const [domainList, setDomainList] = useState([]);

  // 去除空key-value
  function trimKeyValue(item) {
    let res = [];
    for (let i = 0; i < item.length; i++) {
      if (item[i].key !== undefined) {
        res.push(item[i]);
      }
    }
    return res;
  }

  const appListData = () => {
    list({ current: 1, pageSize: 1000 }).then((res) => {
      if (res.code === 200 && res.data) {
        const applicationData = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setAppList(applicationData);
      }
    });
  };

  const doaminListData = () => {
    domainlist({ current: 1, pageSize: 1000 }).then((res) => {
      if (res.code === 200 && res.data) {
        const domainData = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDomainList(domainData);
      }
    });
  };

  useEffect(() => {
    appListData();
    doaminListData();
  }, []);

  const onFinish = () => {
    setIsloading(true);

    if (props.record === null) {
      save({
        ...formRef.current.getFieldValue(),
        requestHeaders: trimKeyValue(reqHeaderArray),
        envVariables: trimKeyValue(envVarArray),
      }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success('修改成功！');
          props.actionRef.current.reload();
          props.setIsModalOpen(false);
          form.resetFields();
          props.setRecord(null);
        }
      });
    } else {
      save({
        ...formRef.current.getFieldValue(),
        id: props.record.id,
        requestHeaders: trimKeyValue(reqHeaderArray),
        envVariables: trimKeyValue(envVarArray),
      }).then((result) => {
        setIsloading(false);
        if (result.code === 200) {
          message.success('修改成功！');
          props.actionRef.current.reload();
          props.setIsModalOpen(false);
          form.resetFields();
          props.setRecord(null);
        }
      });
    }
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  useEffect(() => {
    if (props.isModalOpen && props.record !== null && props.record.id !== null) {
      queryById({ id: props.record.id }).then((res) => {
        if (res.code === 200) {
          formRef?.current?.setFieldsValue({
            appId: res.data.appId,
            name: res.data.name,
            domainId: res.data.domainId,
          });
          const reqHeadersList = res.data.requestHeaders;
          const envVarList = res.data.envVariables;
          setReqHeaderArray(reqHeadersList === null ? [] : reqHeadersList);
          setEnvVarArray(envVarList === null ? [] : envVarList);
        }
      });
    } else {
      formRef.current?.resetFields();
      setReqHeaderArray([]);
      setEnvVarArray([]);
    }
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props?.record === null ? '新增环境' : '编辑环境'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        width={700}
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
        <ProForm
          formRef={formRef}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' }, // 隐藏[重置]按钮
            },
            submitButtonProps: {
              style: { display: 'none' }, // 隐藏[提交]按钮
            },
          }}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProForm.Group>
            <ProFormSelect
              showSearch
              options={appList}
              width={260}
              name="appId"
              label="应用"
              rules={[{ required: true }]}
            />
            <ProFormText name="name" label="环境" rules={[{ required: true }]} />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              showSearch
              options={domainList}
              width={260}
              name="domainId"
              label="域名"
              rules={[{ required: true }]}
            />
          </ProForm.Group>

          <ProCard tabs={{ type: 'card' }}>
            <ProCard.TabPane key="requestHeaders" tab="请求头">
              <SetReqHeader
                dataSource={reqHeaderArray}
                setDataSource={setReqHeaderArray}
                isEdit={true}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="envVariablesList" tab="环境变量">
              <SetReqHeader dataSource={envVarArray} setDataSource={setEnvVarArray} isEdit={true} />
            </ProCard.TabPane>
          </ProCard>
        </ProForm>
      </Modal>
    </>
  );
};

export default EditEnvConfig;
