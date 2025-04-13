import Assert from '@/pages/ApiCase/ApiCaseDetail/Assert';
import EnvVarComponent from '@/pages/ApiCase/ApiCaseDetail/EnvVarComponent';
import ReqHeader from '@/pages/ApiCase/ApiCaseDetail/ReqHeader';
import ReqParam from '@/pages/ApiCase/ApiCaseDetail/ReqParam';
import { appApiList, queryApiById } from '@/services/api';
import { listAll } from '@/services/application';
import { getAppIds } from '@/services/encrypt';
import { porcessNodeDetail, porcessNodeSave } from '@/services/processCaseNode';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { ProCard, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Drawer, message, Radio, Space, Tooltip } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useRef, useState } from 'react';
import { arrayToJson, jsonToArray } from '../../../common';

// 用例节点编辑页
const EditCaseNode = (props) => {
  const { initialState } = useModel('@@initialState');
  const [curAppId, setCurAppId] = useState();
  const [curApiId, setCurApiId] = useState();
  const [apiList, setApiList] = useState([]);
  const [method, setMethod] = useState('-');
  const [path, setPath] = useState('-');
  const [requestParamsTemp, setRequestParamsTemp] = useState();
  const [reqParams, setReqParams] = useState();
  const [assertsArray, setAssertsArray] = useState([]);
  const [reqHeaderArray, setReqHeaderArray] = useState([]);
  const [activeTab, setActiveTab] = useState(['requestParams']);
  const [response, setResponse] = useState();
  const [secretList, setSecretList] = useState([]);
  const [appList, setAppList] = useState([]);

  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [outputParams, setOutputParams] = useState([]);

  const defaultDrawerWidth = 800;
  const largeDrawerWidth = 1200;
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const applicationList = () => {
    listAll().then((res) => {
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

  useEffect(() => {
    applicationList();
  }, [curAppId]);

  // 生成JSON格式请求头头
  function genRequestHeadersJSON() {
    if (activeTab.indexOf('requestHeaders') === -1) {
      if (response === undefined || response === null) {
        return null;
      } else {
        return response.data.requestHeaders;
      }
    }
    return arrayToJson(reqHeaderArray);
  }

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
          if (res.data === null || res.data.id === null) {
            setIsEdit(true);
          } else {
            setIsEdit(false);
          }
        }
        formRef?.current?.setFieldsValue({
          name: res.data.name,
          appId: res.data.appId,
          apiId: res.data.apiId,
          secretId: res.data.secretId,
        });
        const requestParams = res.data.requestParams;
        if (
          requestParams !== undefined &&
          requestParams !== null &&
          requestParams !== ''
          // Object.keys(JSONbig.parse(requestParams)).length > 0
        ) {
          setReqParams(JSON.stringify(JSONbig.parse(requestParams), null, 4));
          handleClickApiName(res.data.apiId, false);
        } else {
          setReqParams();
          handleClickApiName(res.data.apiId, true);
        }
        setResponse(res);
        setCurAppId(res.data.appId);
        setCurApiId(res.data.apiId);
        setReqHeaderArray(jsonToArray(res.data.requestHeaders));
        setAssertsArray(genAssertsArray(res.data.assertsArray));
        setOutputParams(jsonToArray(res.data.outputParams));
      }
    });
  }

  // 生成断言Array
  function genAssertsArray(asserts) {
    if (asserts === null || asserts === undefined) {
      return [];
    } else {
      return asserts;
    }
  }

  // curAppId变化时，重新请求apiList
  useEffect(() => {
    queryApiList();
  }, [curAppId]);

  // 选择接口名时，更新method和path
  function handleClickApiName(apiId, isSetReqParam) {
    if (apiId !== undefined && apiId !== null) {
      queryApiById({ id: apiId }).then((res) => {
        if (res.code === 200) {
          const curName = formRef?.current?.getFieldsValue().name;
          if (curName === undefined || curName === null || curName === 'TestCaseNode node') {
            formRef?.current?.setFieldsValue({
              name: res.data.name,
            });
            handleNameChange(res.data.name);
          }
          setMethod(res.data.method);
          setPath(res.data.path);
          setRequestParamsTemp(res.data.requestParams);
          if (
            isSetReqParam === true &&
            res.data.requestParams !== undefined &&
            res.data.requestParams !== null
          ) {
            const reqTempJson = JSONbig.parse(res.data.requestParams);
            let json = {};
            for (let key of Object.keys(reqTempJson)) {
              json[key] = '';
            }
            setReqParams(JSON.stringify(JSONbig.parse(JSON.stringify(json)), null, 4));
          }
        }
      });
    }
  }

  // 查询接口列表
  const queryApiList = () => {
    if (curAppId !== undefined && curAppId !== '' && curAppId !== null) {
      appApiList({ appId: curAppId }).then((result) => {
        if (result.code === 200) {
          setApiList(
            result.data.map((item) => ({
              value: item.id,
              label: item.path,
              method: item.method,
              path: item.path,
              requestParams: item.requestParams,
            })),
          );
        } else {
          message.error('查询接口列表失败');
        }
      });
    }
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['label'] = value;
      }
    }
  };

  // 点击保存或修改
  const handleFinish = (values) => {
    if (isEdit) {
      for (let i = 0; i < props.nodes.length; i++) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
      handleNameChange(values.name);
      props.align();
      porcessNodeSave({
        id: props.curNodeId,
        caseId: caseId,
        appId: values.appId,
        apiId: values.apiId,
        secretId: values.secretId,
        requestHeaders: genRequestHeadersJSON(),
        requestParams: reqParams,
        assertsArray: genAssertsArrayJSON(),
        outputParams: arrayToJson(outputParams),
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

  // 首次进入页面
  useEffect(() => {
    if (curAppId !== null) {
      queryAllSecret(curAppId);
    }
  }, [curAppId]);

  const queryAllSecret = (value) => {
    getAppIds({ appId: value }).then((res) => {
      if (res.code === 200) {
        const data = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setSecretList(data);
      }
    });
  };

  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
    formRef.current.resetFields();
  };

  const handlePase = () => {
    setNodeInfo(props.copyNodeId, true);
    setIsEdit(true);
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
        title="编辑用例节点"
        width={drawerWidth}
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
            <Button
              onClick={() => {
                if (drawerWidth === defaultDrawerWidth) {
                  setDrawerWidth(largeDrawerWidth);
                } else {
                  setDrawerWidth(defaultDrawerWidth);
                }
              }}
            >
              {drawerWidth === defaultDrawerWidth ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
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
            width="680px"
            label="节点名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />
          <ProForm.Group>
            <ProFormSelect
              showSearch
              options={appList}
              width="290px"
              name="appId"
              label="应用名"
              onChange={(e) => setCurAppId(e)}
              rules={[{ required: isEdit }]}
              disabled={!isEdit}
            />
            <ProFormSelect
              options={secretList}
              width="290px"
              name="secretId"
              label="加密参数"
              disabled={!isEdit}
              placeholder="仅三方接口需要加密"
            />
          </ProForm.Group>

          <ProFormSelect
            showSearch
            options={apiList}
            width="670px"
            name="apiId"
            label="接口路径"
            onChange={(e) => {
              setCurApiId(e);
              handleClickApiName(e, true);
            }}
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />
          <ProForm.Group>
            <Radio.Group size="small" style={{ marginBottom: 10 }}>
              <Radio.Button>{method}</Radio.Button>
              <Radio.Button onClick={() => window.open('/application/apimanage?id=' + curApiId)}>
                {path}
              </Radio.Button>
            </Radio.Group>
          </ProForm.Group>
          <ProForm.Group>
            <ProCard
              tabs={{
                type: 'card',
                onChange: (e) => {
                  setActiveTab([...activeTab, e]);
                },
              }}
              style={{ marginBottom: 10 }}
              size="small"
              title="设置用例参数"
            >
              <ProCard.TabPane key="requestParams" tab="请求参数">
                <ReqParam
                  isEdit={isEdit}
                  reqParams={reqParams}
                  setReqParams={setReqParams}
                  requestParamsTemp={requestParamsTemp}
                />
              </ProCard.TabPane>
              <ProCard.TabPane
                key="requestHeaders"
                tab="请求头"
                style={{ width: '204vh', maxWidth: '100%' }}
              >
                <ReqHeader
                  isEdit={isEdit}
                  dataSource={reqHeaderArray}
                  setDataSource={setReqHeaderArray}
                />
              </ProCard.TabPane>
              <ProCard.TabPane
                key="assertsArray"
                tab="断言"
                style={{ width: '204vh', maxWidth: '100%' }}
              >
                <Assert
                  isEdit={isEdit}
                  enableEdit={enableEdit}
                  dataSource={assertsArray}
                  setDataSource={setAssertsArray}
                  nodeId={props.curNodeId}
                />
              </ProCard.TabPane>
            </ProCard>
          </ProForm.Group>

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
    </>
  );
};

export default EditCaseNode;
