import CaseVar from '@/pages/ApiCase/ApiCaseDetail/CaseVar';
import CommonVar from '@/pages/ApiCase/ApiCaseDetail/CommonVar';
import EnvVarComponent from '@/pages/ApiCase/ApiCaseDetail/EnvVarComponent';
// import { queryLastSucOneByCase } from '@/services/mulTestcaseResult';
import { arrayToJson } from '@/common';
import { processSubList } from '@/services/processCase';
import { porcessNodeDetail, porcessNodeSave } from '@/services/processCaseNode';
import { ProCard, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Drawer, Form, message, Space, Tooltip, Typography } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useRef, useState } from 'react';

// 子流程节点编辑页
const EditSubProcess = (props) => {
  const { Paragraph } = Typography;
  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [mulCaseList, setMulCaseList] = useState([]);
  const [inputParams, setInputParams] = useState([]);
  const [outputParams, setOutputParams] = useState('{}');
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);

  // 节点发生变化时，查询节点详情
  useEffect(() => {
    if (
      props.open === true &&
      props.curNodeId !== undefined &&
      props.curNodeId !== null &&
      props.curNodeId !== ''
    ) {
      setNodeInfo(props.curNodeId, false);
    }
  }, [props.open, props.curNodeId]);

  function setNodeInfo(nodeId, isCopy) {
    porcessNodeDetail({ id: nodeId }).then((res) => {
      if (res.code === 200 && res.data !== null) {
        if (isCopy === false) {
          if (res.data.id === null) {
            setIsEdit(true);
          } else {
            setIsEdit(false);
          }
        }
        formRef?.current?.setFieldsValue({
          name: res.data.name,
          subCaseId: res.data.subCaseId,
        });
        setInputParams(jsonToArray(res.data.inputParams));
        if (res.data.subCaseId !== null) {
          handleCaseChange(res.data.subCaseId);
        }
      }
    });
  }

  // 首次进入页面，查询场景用例列表
  useEffect(() => {
    processSubList().then((result) => {
      if (result.code === 200) {
        setMulCaseList(
          result.data
            .filter((item) => item.id !== parseInt(caseId))
            .map((item) => ({
              value: item.id,
              label: item.name,
            })),
        );
      }
    });
  }, []);

  // 点击保存或修改
  const handleFinish = (values) => {
    if (isEdit) {
      for (let i = 0; i < props.nodes.length; i++) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
      props.align();
      handleNameChange(values.name);
      porcessNodeSave({
        id: Number(props.curNodeId),
        caseId: caseId,
        subCaseId: values.subCaseId,
        inputParams: arrayToJson(inputParams),
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

  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['label'] = value;
      }
    }
  };

  // 子流程最近一次执行成功的出参：
  const handleCaseChange = (e) => {
    // queryLastSucOneByCase({ caseId: e }).then((res) => {
    //   if (res.code === 200) {
    //     const outputParams = res?.data?.outputParams;
    //     if (outputParams !== undefined && outputParams !== null) {
    //       setOutputParams(outputParams);
    //     } else {
    //       setOutputParams('{}');
    //     }
    //   }
    // });
    // formRef?.current?.setFieldsValue({
    //   name: mulCaseList.filter((item) => item.value === e).map((item) => item.label)[0],
    // });
  };

  const handleClickDetail = () => {
    const subCaseId = formRef?.current?.getFieldsValue('subCaseId')?.subCaseId;
    if (subCaseId !== null && subCaseId !== undefined) {
      window.open('/case/proces/detail?id=' + subCaseId);
    } else {
      message.error('请选择子流程');
    }
  };

  const handlePase = () => {
    setNodeInfo(props.copyNodeId, true);
  };

  const handleCopy = () => {
    props.setCopyNodeId(props.curNodeId);
    message.success('复制成功');
  };

  return (
    <>
      <Drawer
        title="编辑子流程"
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
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="节点名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />
          <ProForm.Group>
            <ProFormSelect
              showSearch
              options={mulCaseList}
              name="subCaseId"
              label="子流程"
              width={380}
              onChange={(e) => {
                handleCaseChange(e);
              }}
              rules={[{ required: isEdit }]}
              disabled={!isEdit}
            />
            <Button type="primary" onClick={() => handleClickDetail()}>
              详情
            </Button>
          </ProForm.Group>

          <ProCard
            tabs={{ type: 'card' }}
            style={{ marginBottom: 10 }}
            size="small"
            // bordered={true}
          >
            <ProCard.TabPane key="setInput" tab="子流程入参">
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
              <EnvVarComponent
                dataSource={inputParams}
                setDataSource={setInputParams}
                isEdit={isEdit}
                needTestAccount={false}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="output" tab="子流程出参">
              <Form.Item
                style={{
                  marginTop: 0,
                }}
                shouldUpdate
              >
                {() => {
                  return (
                    <Paragraph>
                      <div
                        style={{
                          overflowY: 'auto',
                        }}
                      >
                        {'子流程最近一次执行成功的出参：'}
                        <pre
                          style={{
                            border: 'none',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                          }}
                        >
                          {JSON.stringify(JSONbig.parse(outputParams), null, 2)}
                        </pre>
                      </div>
                    </Paragraph>
                  );
                }}
              </Form.Item>
            </ProCard.TabPane>
          </ProCard>
        </ProForm>
      </Drawer>
      <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} />
    </>
  );
};

export default EditSubProcess;
