import { arrayToJson, jsonToArray } from '@/common';
import Assert from '@/pages/ApiCase/ApiCaseDetail/Assert';
import CaseVar from '@/pages/ApiCase/ApiCaseDetail/CaseVar';
import CommonVar from '@/pages/ApiCase/ApiCaseDetail/CommonVar';
import EnvVarComponent from '@/pages/ApiCase/ApiCaseDetail/EnvVarComponent';
import { listAll } from '@/services/application';
import { getAppList } from '@/services/dataSource';
import { porcessNodeDetail, porcessNodeSave } from '@/services/processCaseNode';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

// SQL节点编辑页
const EditSqlNode = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [dataSourceList, setDataSourceList] = useState([]);
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);
  const [assertsArray, setAssertsArray] = useState([]);
  const [activeTab, setActiveTab] = useState(['sql']);
  const [response, setResponse] = useState();
  const [outputParams, setOutputParams] = useState([]);
  const [appEnum, setAppEnum] = useState([]);
  const [appIdCurrent, setAppIdCurrent] = useState(null);

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

  // 查询当前节点信息
  function setNodeInfo(nodeId, isCopy) {
    porcessNodeDetail({ id: nodeId }).then((res) => {
      if (res.code === 200 && res.data !== null) {
        setResponse(res);
        setAssertsArray(genAssertsArray(res.data.assertsArray));
        setOutputParams(jsonToArray(res.data.outputParams));
        if (isCopy === false) {
          if (res.data.id === null) {
            setIsEdit(true);
          } else {
            setIsEdit(false);
          }
        }
        formRef?.current?.setFieldsValue({
          name: res.data.name,
          appId: res.data.appId,
          dataSourceId: res.data.dataSourceId,
          sqlScript: res.data.sqlScript,
        });

        if (res.data.appId !== null) {
          appIdListData(res.data.appId);
        }
      }
    });
  }

  const appIdListData = (value) => {
    getAppList({ appId: value }).then((result) => {
      if (result.code === 200) {
        const envData = result.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataSourceList(envData);
        setAppIdCurrent(value);
      }
    });
  };

  // 首次进入页面，查询数据源列表
  useEffect(() => {
    appData();
  }, []);

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
        dataSourceId: values.dataSourceId,
        sqlScript: values.sqlScript,
        assertsArray: genAssertsArrayJSON(),
        outputParams: arrayToJson(outputParams),
        nodes: props.nodes,
        edges: props.edges,
        appId: appIdCurrent,
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
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['label'] = value;
      }
    }
  };

  const handlePase = () => {
    setNodeInfo(props.copyNodeId, true);
  };

  const handleCopy = () => {
    props.setCopyNodeId(props.curNodeId);
    message.success('复制成功');
  };

  const enableEdit = () => {
    setIsEdit(true);
  };

  return (
    <>
      <Drawer
        title="编辑SQL节点"
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
          // {...formItemLayout}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="节点名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
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
          <ProFormSelect
            showSearch
            options={dataSourceList}
            name="dataSourceId"
            label="数据源"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />

          <ProCard
            style={{ marginBottom: 10 }}
            size="small"
            bordered={true}
            tabs={{
              type: 'card',
              onChange: (e) => {
                setActiveTab([...activeTab, e]);
              },
            }}
          >
            <ProCard.TabPane key="sql" tab="SQL脚本">
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
                fieldProps={{ rows: 6 }}
                name="sqlScript"
                label=""
                disabled={!isEdit}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="assertsArray" tab="断言">
              <Assert
                isEdit={isEdit}
                enableEdit={enableEdit}
                dataSource={assertsArray}
                setDataSource={setAssertsArray}
                nodeId={props.curNodeId}
              />
            </ProCard.TabPane>
          </ProCard>
          <ProForm.Group>
            <ProCard
              tabs={{ type: 'card' }}
              style={{ marginBottom: 10, width: '770px', maxWidth: '100%' }}
              size="small"
              bordered={true}
            >
              <ProCard.TabPane key="setOutput" tab="设置节点出参">
                <EnvVarComponent
                  dataSource={outputParams}
                  setDataSource={setOutputParams}
                  isEdit={isEdit}
                  needTestAccount={false}
                  valueName="JSONPath"
                  keyName="变量名"
                />
              </ProCard.TabPane>
            </ProCard>
          </ProForm.Group>
        </ProForm>
      </Drawer>
      <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} />
    </>
  );
};

export default EditSqlNode;
