/*
 * @Author: Menghui
 * @Date: 2025-03-15 16:41:19
 * @LastEditTime: 2025-04-12 13:01:15
 * @Description:
 */
import { genEnvVarArray, getTestAccount, trimEnvParams } from '@/common';
import { updateSelectEnvId } from '@/services/ant-design-pro/api.ts';
import { debug as debugApiTestcase, queryById as queryApiCaseById } from '@/services/apiCase';
// import { queryById as queryMulCaseById } from '@/services/mulTestcase/index.js';
// import { debug as debugMulTestcase } from '@/services/mulTestcaseResult';
import { Button, Form, message, Modal, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import EnvVarComponent from './EnvVarComponent';

const Debug = (props) => {
  const [form] = Form.useForm();
  const urlParams = new URL(window.location.href).searchParams;
  const testcaseId = parseInt(urlParams.get('id'));
  const [noDomian, setNoDomian] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [curEnvId, setCurEnvId] = useState(initialState?.currentUser?.selectEnvId ?? 1);
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);
  const [tempReqParams, setTempReqParams] = useState({}); // 临时请求参数
  const [tempTestAccount, setTempTestAccount] = useState({}); // 临时测试账号
  const [isExecButtonLoading, setIsExecButtonLoading] = useState(false);
  const [isModalExecButtonLoading, setIsModalExecButtonLoading] = useState(false);
  const [isModelExecButtonDisable, setIsModelExecButtonDisable] = useState(false);

  const execMulCase = () => {
    setIsModalExecButtonLoading(true);
    let envVar = {};
    let envVarInEnv = {};
    envVarInEnv['envVariables'] = trimEnvParams(tempReqParams);
    envVarInEnv['testaccountID'] = tempTestAccount;
    envVar[curEnvId] = envVarInEnv;
    if (props.caseType === 'processCase') {
      debugApiTestcase({
        id: testcaseId,
        envId: curEnvId,
        inputParams: JSON.stringify(envVar),
      }).then((res) => {
        setIsModalExecButtonLoading(false);
        if (res.code === 200) {
          props.setDebugResult(res.data);
          message.success('执行完成');
          setIsExecModalOpen(false);
        }
      });
    } else {
      // debugMulTestcase({
      //   mulTestcaseId: props.caseId,
      //   envNameId: curEnvId,
      //   inputParams: JSON.stringify(envVar),
      // }).then((res) => {
      //   setIsModalExecButtonLoading(false);
      //   if (res.code === 200) {
      //     window.open('/mulTestCase/detail/debug?id=' + res.data, '_self');
      //     message.success('开始执行用例');
      //     setIsExecModalOpen(false);
      //   } else {
      //     message.error(res);
      //   }
      // });
    }
  };
  const handleCancel = () => {
    setIsExecModalOpen(false);
  };

  // useEffect(() => {
  //   if (curEnvId !== undefined && curEnvId !== null) {
  //     if (
  //       props.caseType === 'apiTestcase' &&
  //       testcaseId !== undefined &&
  //       testcaseId !== null &&
  //       !isNaN(testcaseId)
  //     ) {
  //       getDomainByEnv({
  //         testcaseId: testcaseId,
  //         envNameId: curEnvId,
  //       }).then((res) => {
  //         if (res.code === 200) {
  //           setNoDomian(false);
  //           props.setDomain(res.data);
  //         } else {
  //           setNoDomian(true);
  //           props.setDomain('-');
  //         }
  //       });
  //     }
  //   }
  // }, [curEnvId, testcaseId]);

  const handleEnv = (e) => {
    setCurEnvId(e.target.value);
    updateSelectEnvId({ id: e.target.value });
  };

  useEffect(() => {
    if (isExecModalOpen) {
      if (props.caseType === 'processCase') {
        setIsModelExecButtonDisable(true);
        // queryMulCaseById({ id: props.caseId }).then((res) => {
        //   setTempReqParams(genEnvVarArray(res.data.inputParams, curEnvId));
        //   setTempTestAccount(getTestAccount(res.data.inputParams, curEnvId));
        //   setIsModelExecButtonDisable(false);
        // });
      } else if (props.caseType === 'apiTestcase') {
        setIsModelExecButtonDisable(true);
        queryApiCaseById({ id: props.caseId }).then((res) => {
          console.log('queryApiCaseById--->', res);
          // todo 默认为1 ，后改更改环境
          setTempReqParams(genEnvVarArray(res.data.envVariables, curEnvId));
          setTempTestAccount(getTestAccount(res.data.envVariables, curEnvId));
          setIsModelExecButtonDisable(false);
        });
      } else {
        message.error('不支持的用例类型：' + props.caseType);
      }
    }
  }, [curEnvId]);

  // 场景用例，点击执行弹出执行弹框
  const handleClickExec = (e) => {
    // setIsExecButtonLoading(true);
    form
      .validateFields()
      .then((res) => {
        if (props.caseType === 'peocessCase') {
          //   queryMulCaseById({ id: props.caseId }).then((res) => {
          //     setTempReqParams(genEnvVarArray(res.data.inputParams, curEnvId));
          //     setTempTestAccount(getTestAccount(res.data.inputParams, curEnvId));
          //     setIsExecModalOpen(true);
          //     setIsExecButtonLoading(false);
          //   });
        } else if (props.caseType === 'apiTestcase') {
          queryApiCaseById({ id: props.caseId }).then((res) => {
            console.log('queryApiCaseById----->', res);
            setTempReqParams(genEnvVarArray(res.data.envVariables, curEnvId));
            setTempTestAccount(getTestAccount(res.data.envVariables, curEnvId));
            setIsExecModalOpen(true);
            setIsExecButtonLoading(false);
          });
        } else {
          message.error('不支持的用例类型：' + props.caseType);
        }
      })
      .catch((errInfo) => {
        message.error('环境不能为空');
      });
  };

  return (
    <div>
      <Form layout="inline" form={form} style={{ float: 'right', marginLeft: 0 }}>
        <Form.Item>
          <Button
            type="primary"
            loading={isExecButtonLoading}
            disabled={props.isEdit}
            onClick={(e) => {
              handleClickExec(e);
            }}
          >
            执行
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="执行用例"
        width={800}
        open={isExecModalOpen}
        onOk={execMulCase}
        onCancel={handleCancel}
        okText="执行"
        okButtonProps={{
          loading: isModalExecButtonLoading,
          disabled: isModelExecButtonDisable,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          环境：
          <Radio.Group
            name="radiogroup"
            defaultValue={curEnvId}
            onChange={(e) => handleEnv(e)}
            optionType="button"
            buttonStyle="solid"
            style={{
              marginLeft: 27,
              marginBottom: 10,
            }}
          >
            <Radio value={1}>测试环境</Radio>
            <Radio value={2}>demo环境</Radio>
            <Radio value={3}>生产环境</Radio>
          </Radio.Group>
        </div>
        <Spin spinning={isModelExecButtonDisable} tip="Loading...">
          <EnvVarComponent
            dataSource={tempReqParams}
            setDataSource={setTempReqParams}
            setTestAccount={setTempTestAccount}
            testAccount={tempTestAccount}
            isEdit={true}
            syncEnvVar={null}
            needTestAccount={true}
          />
        </Spin>
      </Modal>
    </div>
  );
};
export default Debug;
