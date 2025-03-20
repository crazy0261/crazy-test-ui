import SetReqHeader from '@/pages/ApiCase/ApiCaseDetail/SetReqHeader';
import { modify } from '@/services/envConfig';
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
  const [initData, setInitData] = useState(false);

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

  const onFinish = () => {
    setIsloading(true);
    modify({
      ...formRef.current.getFieldValue(),
      id: props.record.id,
      requestHeadersList: trimKeyValue(reqHeaderArray),
      envVariablesList: trimKeyValue(envVarArray),
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
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  useEffect(() => {
    if (props.isModalOpen && props.record !== null) {
      formRef?.current?.setFieldsValue({
        appName: props.record.appName,
        name: props.record.name,
        domainId: props.record.domainId,
      });
      const reqHeadersList = props.record.requestHeadersList;
      const envVarList = props.record.envVariablesList;
      setReqHeaderArray(reqHeadersList === null ? [] : reqHeadersList);
      setEnvVarArray(envVarList === null ? [] : envVarList);
      setInitData(true);
    }
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title="编辑环境"
        open={props.isModalOpen}
        onCancel={handleCancel}
        width={700}
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
              options={props.domainList}
              width={260}
              name="domainId"
              label="应用"
              rules={[{ required: true }]}
            />
            {/* <ProFormText name="appName" label="应用名" readonly /> */}
            <ProFormText name="name" label="环境" rules={[{ required: true }]} />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              showSearch
              options={props.domainList}
              width={260}
              name="domainId"
              label="域名"
              rules={[{ required: true }]}
            />
          </ProForm.Group>

          <ProCard tabs={{ type: 'card' }}>
            <ProCard.TabPane key="requestHeadersList" tab="请求头">
              {initData && (
                <SetReqHeader
                  dataSource={reqHeaderArray}
                  setDataSource={setReqHeaderArray}
                  isEdit={true}
                />
              )}
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
