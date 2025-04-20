/*
 * @Author: Menghui
 * @Date: 2025-04-16 02:07:27
 * @LastEditTime: 2025-04-20 22:45:55
 * @Description:
 */

import { genEnvVarArray, getTestAccount } from '@/common';
import { debug as debugApiTestcase, queryById as queryApiCaseById } from '@/services/apiCase';
import { envAppList } from '@/services/envConfig';
import { debugProcessCase, detail } from '@/services/processCase';
import { history } from '@umijs/max';
import { Button, Form, message, Modal, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';
import DebugEnvVarComponen from '../../ProcessCase/ProcessCaseDetail/DebugEnvVarComponen';

const Debug = (props) => {
  const [form] = Form.useForm();
  const isDebug = window.location.href.indexOf('/debug') !== -1;
  const urlParams = new URL(window.location.href).searchParams;
  const testcaseId = parseInt(urlParams.get('id'));
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);
  const [tempReqParams, setTempReqParams] = useState({}); // 临时请求参数
  const [tempTestAccount, setTempTestAccount] = useState({}); // 临时测试账号
  const [isExecButtonLoading, setIsExecButtonLoading] = useState(false);
  const [isModalExecButtonLoading, setIsModalExecButtonLoading] = useState(false);
  const [isModelExecButtonDisable, setIsModelExecButtonDisable] = useState(false);
  const [env, setEnv] = useState([]);
  const [testAccount, setTestAccount] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [isForminit, setIsForminit] = useState(false);
  const [curEnv, setCurEnv] = useState(null);
  const [inputParams, setInputParams] = useState({});

  const processCaseData = (value) => {
    detail({ id: value }).then((res) => {
      if (res.code === 200) {
        const params = res.data?.inputParamsJson;
        // const key = Object.keys(params);
        // const numkey = key.map((key) => parseInt(key, 10));
        // const minKey = Math.min(...numkey);
        setDataSource(params.curEnv);
        setTestAccount(params.curEnv?.testAccount);
      }
    });
  };

  useEffect(() => {
    if (props.appId !== null) {
      appIdListData(props.appId);
    }
    if (props.envData && (props.curEnv !== null || curEnv !== null)) {
      const curIndex = props.curEnv !== null ? props.curEnv : curEnv !== null ? props.curEnv : null;
      setTestAccount(props.envData[curIndex]?.testAccount);
    }
    if (props.envData !== undefined && props.envData !== null) {
      setDataSource(props.envData[curEnv]?.params || []);
    }
  }, [isExecModalOpen, props.envData, curEnv]);

  useEffect(() => {
    if (props.caseType === 'processCase' && !isDebug) {
      processCaseData(props.caseId);
    }
  }, []);

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

        if (envData.length > 0) {
          setCurEnv(envData[0].value);
        }
      }
    });
  };

  const execMulCase = () => {
    setIsModalExecButtonLoading(true);
    if (props.caseType === 'apiTestcase') {
      debugApiTestcase({
        id: testcaseId,
        envId: curEnv,
        inputParams: dataSource,
        testAccount: testAccount,
        mode: 'manual',
      }).then((res) => {
        setIsModalExecButtonLoading(false);
        if (res.code === 200) {
          props.setDebugResult(res.data);
          message.success('执行完成');
          setIsExecModalOpen(false);
        }
      });
    } else {
      debugProcessCase({
        id: props.caseId,
        envId: curEnv,
        testAccount: testAccount,
        inputParams: dataSource,
        mode: 'manual',
      }).then((res) => {
        setIsModalExecButtonLoading(false);
        if (res.code === 200) {
          message.success('开始执行用例');
          history.push('/case/proces/detail/debug?id=' + res.data);
          setIsExecModalOpen(false);
        }
      });
    }
  };
  const handleCancel = () => {
    setIsExecModalOpen(false);
    setIsForminit(!isForminit);
  };

  // const handleEnv = (e) => {
  //   setCurEnvId(e.target.value);
  //   updateSelectEnvId({ id: e.target.value });
  // };

  useEffect(() => {
    if (isExecModalOpen) {
      if (props.caseType === 'processCase') {
        setIsModelExecButtonDisable(true);
        detail({ id: props.caseId }).then((res) => {
          const data = res.data.inputParamsJson;
          setInputParams(data);

          const firstKey = Object.keys(data)[0];
          const firstValue = data[firstKey];
          setCurEnv(firstKey);
          setTestAccount(firstValue?.testAccount);
          setDataSource(data[firstKey]?.params);

          setIsModelExecButtonDisable(false);
        });
      } else if (props.caseType === 'apiTestcase') {
        setIsModelExecButtonDisable(true);
        queryApiCaseById({ id: props.caseId }).then((res) => {
          // todo 默认为1 ，后改更改环境
          setTempReqParams(genEnvVarArray(res.data.envVariables, curEnv));
          setTempTestAccount(getTestAccount(res.data.envVariables, curEnv));
          setIsModelExecButtonDisable(false);
        });
      } else {
        message.error('不支持的用例类型：' + props.caseType);
      }
    }
  }, [isExecModalOpen]);

  // 场景用例，点击执行弹出执行弹框
  const handleClickExec = (e) => {
    // setIsExecButtonLoading(true);
    form
      .validateFields()
      .then((res) => {
        if (props.caseType === 'processCase') {
          //   queryMulCaseById({ id: props.caseId }).then((res) => {
          //     setTempReqParams(genEnvVarArray(res.data.inputParams, curEnvId));
          //     setTempTestAccount(getTestAccount(res.data.inputParams, curEnvId));
          setIsExecModalOpen(true);
          //     setIsExecButtonLoading(false);
          //   });
        } else if (props.caseType === 'apiTestcase') {
          queryApiCaseById({ id: props.caseId }).then((res) => {
            setTempReqParams(genEnvVarArray(res.data.envVariables, curEnv));
            setTempTestAccount(getTestAccount(res.data.envVariables, curEnv));
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

  const handleEnv = (e) => {
    setCurEnv(e.target.value);
    setTestAccount(inputParams[e.target.value]?.testAccount);
    setDataSource(inputParams[e.target.value]?.params);
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
            defaultValue={curEnv !== null ? curEnv : props.curEnv}
            onChange={handleEnv}
            optionType="button"
            buttonStyle="solid"
            style={{
              marginLeft: 27,
              marginBottom: 10,
            }}
          >
            {env.map((env) => (
              <Radio key={env.value} value={env.value}>
                {env.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <Spin spinning={isModelExecButtonDisable} tip="Loading...">
          {curEnv && (
            <DebugEnvVarComponen
              isExecModalOpen={isExecModalOpen}
              setTestAccount={(newTestAccount) => setTestAccount(newTestAccount)}
              testAccount={testAccount}
              isEdit={true}
              needTestAccount={true}
              envData={props.envData}
              curEnv={curEnv !== null ? curEnv : props.curEnv}
              dataSource={dataSource}
              isForminit={isForminit}
              setDataSource={(value) => setDataSource(value)}
            />
          )}
        </Spin>
      </Modal>
    </div>
  );
};
export default Debug;
