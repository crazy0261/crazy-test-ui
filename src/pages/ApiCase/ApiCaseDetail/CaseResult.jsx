import { ProCard } from '@ant-design/pro-components';
import { Collapse, Form, List, Typography } from 'antd';
import { useEffect, useState } from 'react';

const CaseResult = (props) => {
  const { Panel } = Collapse;
  const { Paragraph } = Typography;
  const [assertResultText, setAssertResultText] = useState('暂无');
  const [assertResultColor, setAssertResultColor] = useState('gray');
  const [failReason, setFailReason] = useState();
  const [responseBody, setResponseBody] = useState({});
  const [requestHeaders, setRequestHeaders] = useState({});
  const [requestParams, setRequestParams] = useState({});
  const [reqUrl, setReqUrl] = useState(null);
  const [pass, setPass] = useState(true);
  const [startExecTime, setStartExecTime] = useState();
  const [execTime, setExecTime] = useState();
  const [execEnvName, setExecEnvName] = useState('-');

  useEffect(() => {
    const isPass = props.debugResult?.assertResultVo?.pass;

    if (isPass !== undefined) {
      setPass(isPass);
      if (isPass) {
        setAssertResultText('成功');
        setAssertResultColor('green');
      } else {
        setAssertResultText('失败');
        setAssertResultColor('red');
        setFailReason(props.debugResult?.assertResultVo?.message);
      }
      setResponseBody(props.debugResult?.response);
      setRequestHeaders(props.debugResult?.requestHeaders);
      setRequestParams(props.debugResult?.requestParams);
      setReqUrl(props.debugResult?.requestUrl);
      setStartExecTime(props.debugResult?.startExecTime);
      setExecTime(props.debugResult?.execTime);
      setExecEnvName(props.debugResult?.envName);
    } else {
      setAssertResultText('暂无');
      setAssertResultColor('gray');
      setFailReason();
      setResponseBody({});
      setRequestHeaders({});
      setRequestParams({});
      setPass(true);
      setStartExecTime('-');
      setExecTime('-');
      setExecEnvName('-');
    }
  }, [props.debugResult]);

  const preStyle = {
    border: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  };

  const divStyle = {
    overflowY: 'auto',
    height: 600,
  };

  return (
    <div>
      <Form>
        <b style={{ color: assertResultColor, float: 'left' }}>执行结果：{assertResultText}</b>
        {assertResultText !== '暂无' && (
          <div>
            <br />
            {/* <li>环境顺序：{execEnvName}</li> */}
            <li>执行时间：{startExecTime}</li>
            <li>执行耗时：{execTime} ms</li>
          </div>
        )}
        {!pass && failReason !== null && failReason !== undefined && (
          <Collapse size="small" defaultActiveKey={['1']} style={{ marginTop: 10 }}>
            <Panel header="失败断言：" key="1">
              <List
                style={{ marginBottom: 5 }}
                size="small"
                bordered
                dataSource={failReason}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Panel>
          </Collapse>
        )}
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{ marginTop: 10, height: 700 }}
        >
          <ProCard.TabPane key="tab1" tab="ResBody">
            <Form.Item
              style={{
                marginTop: 0,
              }}
              shouldUpdate
            >
              {() => {
                return (
                  <Paragraph>
                    <div style={divStyle}>
                      <pre style={preStyle}>{JSON.stringify(responseBody, null, 2)}</pre>
                    </div>
                  </Paragraph>
                );
              }}
            </Form.Item>
          </ProCard.TabPane>
          {props.outputParams !== undefined && (
            <ProCard.TabPane key="tab6" tab="节点出参">
              <Form.Item
                style={{
                  marginTop: 0,
                }}
                shouldUpdate
              >
                {() => {
                  return (
                    <Paragraph>
                      <div style={divStyle}>
                        <pre style={preStyle}>{JSON.stringify(props.outputParams, null, 2)}</pre>
                      </div>
                    </Paragraph>
                  );
                }}
              </Form.Item>
            </ProCard.TabPane>
          )}

          <ProCard.TabPane key="tab5" tab="ReqURL">
            <Form.Item
              style={{
                marginTop: 0,
              }}
              shouldUpdate
            >
              {() => {
                return (
                  <Paragraph>
                    <pre style={{ border: 'none' }}>{reqUrl}</pre>
                  </Paragraph>
                );
              }}
            </Form.Item>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="ReqParam">
            <Form.Item
              style={{
                marginTop: 0,
              }}
              shouldUpdate
            >
              {() => {
                return (
                  <Paragraph>
                    <div style={divStyle}>
                      <pre style={preStyle}>{JSON.stringify(requestParams, null, 2)}</pre>
                    </div>
                  </Paragraph>
                );
              }}
            </Form.Item>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab4" tab="ReqHeader">
            <Form.Item
              style={{
                marginTop: 0,
              }}
              shouldUpdate
            >
              {() => {
                return (
                  <Paragraph>
                    <div style={divStyle}>
                      <pre style={preStyle}>{JSON.stringify(requestHeaders, null, 2)}</pre>
                    </div>
                  </Paragraph>
                );
              }}
            </Form.Item>
          </ProCard.TabPane>
        </ProCard>
      </Form>
    </div>
  );
};

export default CaseResult;
