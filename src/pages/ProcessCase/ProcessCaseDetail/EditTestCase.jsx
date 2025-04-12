import { priorityList } from '../../../common';
// import { queryById as queryExecResult } from '@/services/mulTestcaseResult';
import EnvVar from '@/pages/ApiCase/ApiCaseDetail/EnvVar';
import { listAll } from '@/services/application';
import { envAppList } from '@/services/envConfig';
import { detail, save } from '@/services/processCase';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 开始节点编辑页
const EditTestCase = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const isDebug = window.location.href.indexOf('/debug') !== -1;
  const id = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState();
  const [priority, setPriority] = useState();
  const [isSubProcess, setIsSubProcess] = useState();
  const [env, setEnv] = useState([]);
  const [curEnv, setCurEnv] = useState(null);
  const [appEnum, setAppEnum] = useState([]);
  const [envData, setEnvData] = useState({}); // 所有环境的数据
  const [appIdCurrent, setAppIdCurrent] = useState(null);

  let resStatus = 'INIT';

  // 更新环境参数
  const updateEnvParams = (envId, newParams) => {
    setEnvData((prev) => ({
      ...prev,
      [envId]: {
        ...prev[envId],
        params: newParams,
      },
    }));
  };

  // 更新测试账号
  const updateTestAccount = (envId, newTestAccount) => {
    setEnvData((prev) => ({
      ...prev,
      [envId]: {
        ...prev[envId],
        testAccount: newTestAccount,
      },
    }));
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

        if (envData.length > 0) {
          setCurEnv(envData[0].value);
        }
      }
    });
  };

  useEffect(() => {
    appData();
    if (!isDebug) {
      queryCaseDetail();
    }
  }, []);

  // 每隔1秒执行一次
  useEffect(() => {
    const interval = setInterval(() => {
      queryResult(resStatus);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 用例结果页详情-
  function queryResult() {
    // if (isDebug) {
    //   if (resStatus === 'INIT' || resStatus === 'RUNNING') {
    //     queryExecResult({ id: id }).then((res) => {
    //       if (res.code === 200 && res.data !== null) {
    //         props.setCaseStatus(res.data.status);
    //         resStatus = res.data.status;
    //         props.setCaseName(res.data.testcaseName);
    //         props.setEnvName(res.data.envName);
    //         props.setCaseId(res.data.testcaseId);
    //         props.setInputParams(JSONbig.parse(res.data.inputParams)?.[res.data.envNameId]);
    //         props.setOutputParams(JSONbig.parse(res.data.outputParams));
    //         if (res.data.nodeArray !== null) {
    //           props.setNodes(res.data.nodeArray);
    //         }
    //         if (res.data.edgeArray !== null) {
    //           props.setEdges(res.data.edgeArray);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  // 用例编辑页详情
  const queryCaseDetail = () => {
    detail({ id: id }).then((res) => {
      if (res.code === 200) {
        props.setCaseName(res.data.name);
        setName(res.data.name);
        setPriority(res.data.priority);
        setAppIdCurrent(res.data.appId);
        setIsSubProcess(res.data.isSubProcess);
        setEnvData(res.data.inputParamsJson);
        appIdListData(res.data.appId);
        if (res.data.nodeArray !== null) {
          props.setNodes(res.data.nodeArray);
        }
        if (res.data.edgeArray !== null) {
          props.setEdges(res.data.edgesArray);
        }
      }
    });
  };

  // 点击保存或修改
  const handleFinish = (values) => {
    const inputParams = Object.keys(envData).reduce((acc, envId) => {
      acc[envId] = {
        params: envData[envId].params,
        testAccount: envData[envId].testAccount,
      };
      return acc;
    }, {});

    if (isEdit) {
      for (let i = 0; i < props.nodes.length; i++) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
      props.align();
      props.setCaseName(values.name);
      save({
        id: id,
        name: values.name,
        appId: values.appId,
        priority: values.priority,
        isSubProcess: values.isSubProcess,
        inputParams: inputParams,
        nodes: props.nodes,
        edges: props.edges,
      }).then((res) => {
        if (res.code === 200) {
          setIsEdit(false);
          message.success('修改成功');
        }
      });
    } else {
      setIsEdit(true);
    }
  };

  // const formItemLayout = {
  //   labelCol: { span: 0 },
  //   wrapperCol: { span: 0 },
  // };

  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
  };

  return (
    <>
      <Drawer title="编辑用例" width={800} onClose={onClose} open={props.open}>
        <ProForm
          formRef={formRef}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' }, // 隐藏[重置]按钮
            },
            searchConfig: {
              submitText: isEdit ? '保存' : '编辑',
            },
          }}
          // {...formItemLayout}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="用例名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
            initialValue={name}
          />
          <ProForm.Group width="100%">
            <ProFormSelect
              options={priorityList}
              width="sm"
              name="priority"
              label="优先级"
              rules={[{ required: isEdit }]}
              disabled={!isEdit}
              initialValue={priority}
            />
            <ProFormSelect
              options={[
                {
                  value: 1,
                  label: '是',
                },
                {
                  value: 0,
                  label: '否',
                },
              ]}
              width="sm"
              name="isSubProcess"
              label="子流程"
              rules={[{ required: isEdit }]}
              disabled={!isEdit}
              initialValue={isSubProcess}
            />

            <ProFormSelect
              options={appEnum}
              width="sm"
              name="appId"
              label="应用"
              rules={[{ required: isEdit }]}
              disabled={!isEdit}
              onChange={appIdListData}
              initialValue={appIdCurrent}
            />
          </ProForm.Group>
          <ProForm.Group>
            <EnvVar
              isEdit={isEdit}
              envData={env}
              envParams={envData}
              curEnv={curEnv}
              updateEnvParams={updateEnvParams}
              updateTestAccount={updateTestAccount}
            />
          </ProForm.Group>
        </ProForm>
      </Drawer>
    </>
  );
};

export default EditTestCase;
