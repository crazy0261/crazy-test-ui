import { priorityList } from '@/common';
import { add as addApiTestcase, modify as modifyApiTestcase, queryById } from '@/services/apiCase';
import { list as listApiManagement, queryApiById } from '@/services/apiManagement';
import { list } from '@/services/applicationManagement';
import { listPage } from '@/services/domain';
// import { listAll } from '@/services/config/secretManage';
import { ProCard, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { message, Radio } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useRef, useState } from 'react';
import SetAssert from './SetAssert';
import SetEnvVar from './SetEnvVar';
import SetReqHeader from './SetReqHeader';
import SetReqParam from './SetReqParam';
import './index.scss';

const CaseDetail = (props) => {
  const [appList, setAppList] = useState([]);
  const urlParams = new URL(window.location.href).searchParams;
  const [id, setId] = useState(urlParams.get('id'));
  props.setTestcaseId(parseInt(id));

  const apiName = urlParams.get('apiName');
  const apiIdTemp = urlParams.get('apiId');
  const [curApiId, setCurApiId] = useState(
    apiIdTemp === undefined || apiIdTemp === null ? null : Number.parseInt(apiIdTemp),
  );
  if (curApiId !== null) {
    handleClickApiName(curApiId);
  }
  const appIdTemp = urlParams.get('appId');
  const [curAppId, setCurAppId] = useState(
    appIdTemp === undefined || appIdTemp === null ? null : Number.parseInt(appIdTemp),
  );
  const methodTemp = urlParams.get('method');
  const [method, setMethod] = useState(
    methodTemp === undefined || methodTemp === null ? '-' : methodTemp,
  );

  const pathTemp = urlParams.get('path');
  const [path, setPath] = useState(pathTemp === undefined || pathTemp === null ? '-' : pathTemp);

  const formRef = useRef();
  const [apiList, setApiList] = useState([]);
  const [response, setResponse] = useState();
  const [testEnvParams, setTestEnvParams] = useState([]);
  const [demoEnvParams, setDemoEnvParams] = useState([]);
  const [prodEnvParams, setProdEnvParams] = useState([]);
  const [testAccountInTest, setTestAccountInTest] = useState();
  const [testAccountInDemo, setTestAccountInDemo] = useState();
  const [testAccountInProd, setTestAccountInProd] = useState();
  const [reqParams, setReqParams] = useState(null);
  const [assertsArray, setAssertsArray] = useState([]);
  const [reqHeaderArray, setReqHeaderArray] = useState([]);
  const [hasReqParams, setHasReqParams] = useState(false);
  const [requestParamsTemp, setRequestParamsTemp] = useState(curApiId === null ? null : undefined);
  const [activeTab, setActiveTab] = useState(['requestParams']);
  const [secretList, setSecretList] = useState([]);
  const [domainUrl, setDomainUrl] = useState('-');

  useEffect(() => {
    applicationList();
  }, []);

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 0 },
  };

  const applicationList = () => {
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

  // 查询接口列表
  const queryApiList = () => {
    if (curAppId !== '' && curAppId !== null) {
      setApiList([]);
      listApiManagement({ applicationId: curAppId }).then((result) => {
        if (result.code === 200) {
          setApiList(
            result.data.map((item) => ({
              value: item.id,
              // label: item.name,
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

  // 生成断言Array
  function genAssertsArray(res) {
    const asserts = res.data.assertsArray;
    if (asserts === null || asserts === undefined) {
      return [];
    } else {
      return asserts;
    }
  }

  // 查询用例详情
  const queryTestcaseDetailById = () => {
    if (id !== undefined && id !== null) {
      queryById({ id: id }).then((res) => {
        const requestParams = res.data.requestParams;
        if (
          requestParams !== undefined &&
          requestParams !== null &&
          Object.keys(JSONbig.parse(requestParams)).length > 0
        ) {
          setHasReqParams(true);
        }
        formRef?.current?.setFieldsValue({
          name: res.data.name,
          appId: res.data.appId,
          apiId: res.data.apiId,
          priority: res.data.priority,
          secretId: res.data.secretId,
          creatorName: res.data.creatorName,
        });
        props.setTestcaseName(res.data.name);
        setResponse(res);
        setMethod(res.data.method);
        setPath(res.data.path);
        setCurAppId(res.data.appId);
        setCurApiId(res.data.apiId);
        handleClickApiName(res.data.apiId);
        // setTestEnvParams(genEnvVarArray(res.data.envVariables, '1'));
        // setDemoEnvParams(genEnvVarArray(res.data.envVariables, '2'));
        // setProdEnvParams(genEnvVarArray(res.data.envVariables, '3'));
        setTestEnvParams(null);
        setDemoEnvParams(null);
        setProdEnvParams(null);
        // setTestAccountInTest(getTestAccount(res.data.envVariables, '1'));
        // setTestAccountInDemo(getTestAccount(res.data.envVariables, '2'));
        // setTestAccountInProd(getTestAccount(res.data.envVariables, '3'));
        setTestAccountInTest(null);
        setTestAccountInDemo(null);
        setTestAccountInProd(null);
        setAssertsArray(genAssertsArray(res));
        // setReqHeaderArray(jsonToArray(res.data.requestHeaders));
        setReqHeaderArray(null);

        setReqParams(JSON.stringify(JSONbig.parse(requestParams), null, 4));
      });
    } else {
      props.setIsEdit(true);
    }
  };

  const initReqParams = () => {
    if (requestParamsTemp !== undefined && requestParamsTemp !== null) {
      const reqTempJson = JSONbig.parse(requestParamsTemp);
      let json = {};
      for (let key of Object.keys(reqTempJson)) {
        json[key] = '';
      }
      setReqParams(JSON.stringify(JSONbig.parse(JSON.stringify(json)), null, 4));
    }
  };

  useEffect(() => {
    if (!hasReqParams) {
      initReqParams();
    }
  }, [requestParamsTemp]);

  const enableEdit = () => {
    props.setIsEdit(true);
  };

  const queryAllSecret = () => {
    // listAll().then((result) => {
    //   if (result.code === 200) {
    //     setSecretList(
    //       result.data.map((item) => ({
    //         value: item.id,
    //         label: item.name,
    //       })),
    //     );
    //   }
    // });
  };

  // 首次进入页面
  useEffect(() => {
    queryTestcaseDetailById();
    queryAllSecret();
  }, []);

  // curAppId变化时，重新请求apiList
  useEffect(() => {
    queryApiList();
  }, [curAppId]);

  // 选择接口名时，更新method和path
  function handleClickApiName(apiId) {
    if (apiId !== undefined && apiId !== null) {
      queryApiById({ id: apiId }).then((res) => {
        if (formRef?.current?.getFieldsValue().name === undefined) {
          formRef?.current?.setFieldsValue({
            name: res.data.name,
          });
        }
        setMethod(res.data.method);
        setPath(res.data.path);
        setRequestParamsTemp(res.data.requestParams);
      });
    }
  }

  const getDomainUrl = (value) => {
    listPage({ appId: value }).then((res) => {
      if (res.code === 200 && res.data.length > 0) {
        setDomainUrl(res?.data[0]?.urlPath);
      }
    });
  };

  // 生成JSON格式请求头头
  function genRequestHeadersJSON() {
    if (activeTab.indexOf('requestHeaders') === -1) {
      if (response === undefined || response === null) {
        return null;
      } else {
        return response.data.requestHeaders;
      }
    }
    // return arrayToJson(reqHeaderArray);
    return null;
  }

  function genAssertsArrayJSON() {
    if (activeTab.indexOf('assertsArray') === -1) {
      if (response === undefined || response === null) {
        return null;
      } else {
        return response.data.assertsArray;
      }
    } else {
      return assertsArray;
    }
  }

  // 点击保存或修改
  const handleFinish = (values) => {
    if (props.isEdit) {
      const urlParams = new URL(window.location.href).searchParams;
      if (urlParams.get('id')) {
        modifyApiTestcase({
          id: props.testcaseId,
          name: values.name,
          priority: values.priority,
          apiId: values.apiId,
          appId: values.appId,
          secretId: values.secretId,
          requestHeaders: genRequestHeadersJSON(),
          requestParams: reqParams,
          assertsArray: genAssertsArrayJSON(),
          // envVariables: genJsonEnvVar(
          //   testEnvParams,
          //   testAccountInTest,
          //   demoEnvParams,
          //   testAccountInDemo,
          //   prodEnvParams,
          //   testAccountInProd,
          // ),
        }).then((res) => {
          if (res.code === 200) {
            props.setIsEdit(false);
            message.success('修改成功');
          }
        });
      } else {
        addApiTestcase({
          name: values.name,
          priority: values.priority,
          apiId: values.apiId,
          appId: values.appId,
          secretId: values.secretId,
          requestHeaders: genRequestHeadersJSON(),
          requestParams: reqParams,
          assertsArray: genAssertsArrayJSON(),
          // envVariables: genJsonEnvVar(
          //   testEnvParams,
          //   testAccountInTest,
          //   demoEnvParams,
          //   testAccountInDemo,
          //   prodEnvParams,
          //   testAccountInProd,
          // ),
        }).then((res) => {
          if (res.code === 200) {
            setId(res.data.id);
            props.setIsEdit(false);
            props.setTestcaseId(res.data.id);
            message.success('新增成功');
            history.push('/apiTestCase/detail?id=' + res.data.id);
          }
        });
      }
    } else {
      props.setIsEdit(true);
    }
  };

  return (
    <div>
      <ProForm
        formRef={formRef}
        submitter={{
          resetButtonProps: {
            style: { display: 'none' }, // 隐藏[重置]按钮
          },
          searchConfig: {
            submitText: props.isEdit ? '保存' : '编辑',
          },
        }}
        {...formItemLayout}
        layout={'LAYOUT_TYPE_HORIZONTAL'}
        onFinish={(e) => handleFinish(e)}
        style={{ marginTop: 10 }}
      >
        <ProForm.Group width="100%">
          <ProFormText
            name="name"
            label="用例名"
            width="380px"
            rules={[{ required: props.isEdit }]}
            disabled={!props.isEdit}
            initialValue={apiName}
          />

          <ProFormSelect
            options={priorityList}
            width="70px"
            name="priority"
            label="优先级"
            rules={[{ required: props.isEdit }]}
            disabled={!props.isEdit}
            initialValue={2}
          />
          <ProFormSelect
            options={secretList}
            width="150px"
            name="secretId"
            label="加密参数"
            disabled={!props.isEdit}
            placeholder="仅三方接口需要加密"
          />
          <ProFormSelect
            showSearch
            options={appList}
            width="200px"
            name="appId"
            label="应用名"
            onChange={(e) => {
              getDomainUrl(e);
              setCurAppId(e);
              setCurApiId();
              formRef?.current?.setFieldsValue({
                apiId: null,
              });
            }}
            rules={[{ required: props.isEdit }]}
            disabled={!props.isEdit}
            initialValue={curAppId}
          />
          <ProFormSelect
            showSearch
            options={apiList}
            name="apiId"
            width="410px"
            label="接口路径"
            onChange={(e) => {
              setCurApiId(e);
              handleClickApiName(e);
            }}
            rules={[{ required: props.isEdit }]}
            disabled={!props.isEdit}
            initialValue={curApiId}
          />
          <ProFormText
            name="creatorName"
            label="作者"
            width="90px"
            rules={[{ required: false }]}
            disabled={true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <Radio.Group
            size="small"
            style={{
              marginBottom: 10,
            }}
          >
            <Radio.Button>{method}</Radio.Button>
            <Radio.Button>{domainUrl}</Radio.Button>
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
              <SetReqParam
                isEdit={props.isEdit}
                reqParams={reqParams}
                setReqParams={setReqParams}
                requestParamsTemp={requestParamsTemp}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="requestHeaders" tab="请求头">
              <SetReqHeader
                isEdit={props.isEdit}
                dataSource={reqHeaderArray}
                setDataSource={setReqHeaderArray}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="assertsArray" tab="断言">
              <SetAssert
                isEdit={props.isEdit}
                enableEdit={enableEdit}
                dataSource={assertsArray}
                setDataSource={setAssertsArray}
              />
            </ProCard.TabPane>
          </ProCard>
        </ProForm.Group>

        <SetEnvVar
          isEdit={props.isEdit}
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
      </ProForm>
    </div>
  );
};
export default CaseDetail;
