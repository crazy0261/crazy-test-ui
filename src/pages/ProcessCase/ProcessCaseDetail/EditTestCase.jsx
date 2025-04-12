// import SetEnvVar from '@/pages/ApiTestCaseDetail/SetEnvVar';
import { priorityList } from '../../../common';
// import { modify, queryById } from '@/services/mulTestcase';
// import { queryById as queryExecResult } from '@/services/mulTestcaseResult';
import EnvVar from '@/pages/ApiCase/ApiCaseDetail/EnvVar';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Drawer } from 'antd';
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
  const [testEnvParams, setTestEnvParams] = useState([]);
  const [demoEnvParams, setDemoEnvParams] = useState([]);
  const [prodEnvParams, setProdEnvParams] = useState([]);
  const [testAccountInTest, setTestAccountInTest] = useState();
  const [testAccountInDemo, setTestAccountInDemo] = useState();
  const [testAccountInProd, setTestAccountInProd] = useState();
  const [caseOutput, setCaseOutput] = useState([]);
  let resStatus = 'INIT';

  useEffect(() => {
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
    // queryById({ id: id }).then((res) => {
    //   if (res.code === 200) {
    //     props.setCaseName(res.data.name);
    //     setName(res.data.name);
    //     setPriority(res.data.priority);
    //     setIsSubProcess(res.data.isSubProcess);
    //     setTestEnvParams(genEnvVarArray(res.data.inputParams, '1'));
    //     setDemoEnvParams(genEnvVarArray(res.data.inputParams, '2'));
    //     setProdEnvParams(genEnvVarArray(res.data.inputParams, '3'));
    //     setTestAccountInTest(getTestAccount(res.data.inputParams, '1'));
    //     setTestAccountInDemo(getTestAccount(res.data.inputParams, '2'));
    //     setTestAccountInProd(getTestAccount(res.data.inputParams, '3'));
    //     setCaseOutput(jsonToArray(res.data.outputParams));
    //     if (res.data.nodeArray !== null) {
    //       props.setNodes(res.data.nodeArray);
    //     }
    //     if (res.data.edgeArray !== null) {
    //       props.setEdges(res.data.edgeArray);
    //     }
    //   }
    // });
  };

  // 点击保存或修改
  const handleFinish = (values) => {
    if (isEdit) {
      for (let i = 0; i < props.nodes.length; i++) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
      props.align();
      props.setCaseName(values.name);
      // modify({
      //   id: id,
      //   name: values.name,
      //   priority: values.priority,
      //   isSubProcess: values.isSubProcess,
      //   inputParams: genJsonEnvVar(
      //     testEnvParams,
      //     testAccountInTest,
      //     demoEnvParams,
      //     testAccountInDemo,
      //     prodEnvParams,
      //     testAccountInProd,
      //   ),
      //   outputParams: arrayToJson(caseOutput),
      //   nodes: props.nodes,
      //   edges: props.edges,
      // }).then((res) => {
      //   if (res.code === 200) {
      //     setIsEdit(false);
      //     message.success('修改成功');
      //   }
      // });
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
          </ProForm.Group>
          <ProForm.Group>
            <EnvVar
              isEdit={isEdit}
              testEnvParams={testEnvParams}
              setTestEnvParams={setTestEnvParams}
              demoEnvParams={demoEnvParams}
              setDemoEnvParams={setDemoEnvParams}
              prodEnvParams={prodEnvParams}
              setProdEnvParams={setProdEnvParams}
              testAccountInTest={testAccountInTest}
              setTestAccountInTest={setTestAccountInTest}
              testAccountInDemo={testAccountInDemo}
              setTestAccountInDemo={setTestAccountInDemo}
              testAccountInProd={testAccountInProd}
              setTestAccountInProd={setTestAccountInProd}
            />
          </ProForm.Group>

          {/* <ProForm.Group>
            <ProCard
              tabs={{ type: 'card' }}
              style={{ marginBottom: 10, width: '770px', maxWidth: '100%' }}
              size="small"
              // title="设置用例出参"
              bordered={true}
            >
              <ProCard.TabPane key="setOutput" tab="设置用例出参">
                <CommonVar
                  dataSource={caseOutput}
                  setDataSource={setCaseOutput}
                  isEdit={isEdit}
                  needTestAccount={false}
                />
              </ProCard.TabPane>
            </ProCard>
          </ProForm.Group> */}
        </ProForm>
      </Drawer>
    </>
  );
};

export default EditTestCase;
