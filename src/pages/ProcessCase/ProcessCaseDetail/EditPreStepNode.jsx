// import CaseVar from '@/pages/ApiTestCaseDetail/CaseVar';
// import CommonVar from '@/pages/ApiTestCaseDetail/CommonVar';
// import SetAssert from '@/pages/ApiTestCaseDetail/SetAssert';
// import { addOrMod, queryNodeInfo } from '@/services/mulTestcase';
import { ProCard, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Drawer, message, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 前置步骤节点 编辑页
const EditPreStepNode = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);
  const [assertsArray, setAssertsArray] = useState([]);
  const [activeTab, setActiveTab] = useState(['groovy']);
  const [response, setResponse] = useState({});

  // 节点发生变化时，查询节点详情
  useEffect(() => {
    if (props.open === true) {
      if (props.curNodeId !== undefined && props.curNodeId !== null) {
        setNodeInfo(caseId, props.curNodeId, false);
      } else {
        console.log('props.curNodeId = ', props.curNodeId);
        console.log('props.curNodeId !== undefined ', props.curNodeId !== undefined);
        console.log('props.curNodeId !== null ', props.curNodeId !== null);
      }
    }
  }, [props.open, props.curNodeId]);

  function setNodeInfo(caseId, nodeId, isCopy) {
    // queryNodeInfo({ caseId: caseId, nodeId: nodeId }).then((res) => {
    //   if (res.code === 200) {
    //     setResponse(res);
    //     if (isCopy === false) {
    //       if (res.data.id === null) {
    //         setIsEdit(true);
    //       } else {
    //         setIsEdit(false);
    //       }
    //     }
    //     formRef?.current?.setFieldsValue({
    //       name: res.data.name,
    //       groovyKey: res.data.groovyKey,
    //       groovyScript: res.data.groovyScript,
    //     });
    //     setAssertsArray(genAssertsArray(res.data.assertsArray));
    //   }
    // });
  }

  const enableEdit = () => {
    setIsEdit(true);
  };

  // 点击保存或修改
  const handleFinish = (values) => {
    // if (isEdit) {
    //   for (let i = 0; i < props.nodes.length; i++) {
    //     props.nodes[i]['data']['borderColor'] = 'black';
    //   }
    //   props.align();
    //   addOrMod({
    //     id: props.curNodeId,
    //     testcaseId: caseId,
    //     groovyKey: values.groovyKey,
    //     groovyScript: values.groovyScript,
    //     assertsArray: genAssertsArrayJSON(),
    //     nodes: props.nodes,
    //     edges: props.edges,
    //   }).then((res) => {
    //     if (res.code === 200) {
    //       setIsEdit(false);
    //       message.success('修改成功');
    //     }
    //   });
    // } else {
    //   setIsEdit(true);
    // }
  };

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 0 },
  };

  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
    formRef?.current?.resetFields();
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['label'] = value;
      }
    }
  };

  const handlePase = () => {
    setNodeInfo(caseId, props.copyNodeId, true);
  };

  const handleCopy = () => {
    props.setCopyNodeId(props.curNodeId);
    message.success('复制成功');
  };

  function genAssertsArrayJSON() {
    if (activeTab.indexOf('assertsArray') === -1) {
      if (response === undefined || response === null) {
        return null;
      } else {
        return response.data.assertsArray;
      }
    }
    return assertsArray;
  }

  // 生成断言Array
  function genAssertsArray(asserts) {
    if (asserts === null || asserts === undefined) {
      return [];
    } else {
      return asserts;
    }
  }

  return (
    <>
      <Drawer
        title="编辑节点"
        width={800}
        onClose={onClose}
        open={props.open}
        extra={
          <Space>
            <Tooltip title="将当前节点及下面的节点，向下移动">
              <Button type="primary" onClick={() => props.moveDown(props.curNodeId)}>
                下移
              </Button>
            </Tooltip>
            <Tooltip title="将当前节点及下面的节点，向上移动">
              <Button type="primary" onClick={() => props.moveUp(props.curNodeId)}>
                上移
              </Button>
            </Tooltip>
            <Button type="primary" disabled={isEdit} onClick={handleCopy}>
              复制
            </Button>
            <Button
              type="primary"
              onClick={handlePase}
              disabled={
                isEdit === false || props.copyNodeId === undefined || props.copyNodeId === null
                  ? true
                  : false
              }
            >
              粘贴
            </Button>
          </Space>
        }
      >
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
          {...formItemLayout}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="节点名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
            onChange={(e) => {
              handleNameChange(e.target.value);
            }}
          />
          <ProFormText
            name="groovyKey"
            label="出参Key"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />
          <ProCard
            style={{ marginBottom: 10 }}
            size="small"
            tabs={{
              type: 'card',
              onChange: (e) => {
                setActiveTab([...activeTab, e]);
              },
            }}
          >
            <ProCard.TabPane key="groovy" tab="Groovy脚本">
              <Button
                size="small"
                type="primary"
                style={{ marginRight: 10, marginBottom: 5 }}
                onClick={() => setCaseVarModalOpen(true)}
              >
                用例变量
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ marginRight: 10, marginBottom: 5 }}
                onClick={() => setCommonVarModalOpen(true)}
              >
                公共变量
              </Button>
              <ProFormTextArea
                colProps={{ span: 24 }}
                name="groovyScript"
                label="出参Value"
                disabled={!isEdit}
                rules={[{ required: isEdit }]}
                fieldProps={{ placeholder: '请输入groovy脚本', style: { height: 250 } }}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="assertsArray" tab="断言">
              {/* <SetAssert
                isEdit={isEdit}
                enableEdit={enableEdit}
                dataSource={assertsArray}
                setDataSource={setAssertsArray}
                nodeId={props.curNodeId}
              /> */}
            </ProCard.TabPane>
          </ProCard>
        </ProForm>
      </Drawer>
      {/* <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} /> */}
    </>
  );
};

export default EditPreStepNode;
