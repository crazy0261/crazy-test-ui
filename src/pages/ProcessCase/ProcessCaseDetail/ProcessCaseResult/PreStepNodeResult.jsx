// import { queryByResultIdAndNodeId } from '@/services/mulTestcaseResultNode';
import { ProCard } from '@ant-design/pro-components';
import { Collapse, Drawer, Form, InputNumber, List, Typography } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

// 前置步骤节点结果页
const PreStepNodeResult = (props) => {
  const { Panel } = Collapse;
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');
  const { Paragraph } = Typography;
  const [res, setRes] = useState();
  const [outputParams, setOutputParams] = useState({});
  const [maxExecTimes, setMaxExecTimes] = useState(0);
  const [curExecTimes, setCurExecTimes] = useState(0);
  const [preStepExecResult, setPreStepExecResult] = useState({});
  const [resultText, setResultText] = useState('暂无');
  const [resultTextColor, setResultTextColor] = useState('gray');
  const [execTime, setExecTime] = useState('暂无');

  useEffect(() => {
    // if (props.open === true && props.curNodeId !== undefined && id !== undefined) {
    //   queryByResultIdAndNodeId({ resultId: id, nodeId: props.curNodeId }).then((res) => {
    //     if (res.code === 200 && res.data !== null) {
    //       setRes(res);
    //       setMaxExecTimes(res.data.length);
    //       setCurExecTimes(0);
    //       if (res.data.length > 0) {
    //         setOutputParams(JSONbig.parse(res.data[0]?.outputParams));
    //         let preStepExecResult = JSONbig.parse(res.data[0]?.preStepExecResult);
    //         setPreStepExecResult(preStepExecResult);
    //         setExecTime(preStepExecResult?.execTime);
    //         if (preStepExecResult?.assertResultVo?.pass === true) {
    //           setResultText('成功');
    //           setResultTextColor('green');
    //         } else if (preStepExecResult?.assertResultVo?.pass === false) {
    //           setResultText('失败');
    //           setResultTextColor('red');
    //         }
    //       } else {
    //         setOutputParams({});
    //         setPreStepExecResult({});
    //         setResultText('暂无');
    //         setResultTextColor('gray');
    //         setExecTime('暂无');
    //       }
    //     } else {
    //       setOutputParams({});
    //     }
    //   });
    // }
  }, [props.curNodeId, props.open]);

  useEffect(() => {
    console.log(curExecTimes);
    if (res !== undefined && res !== null && res.data.length > 0) {
      setOutputParams(JSONbig.parse(res.data[curExecTimes]?.outputParams));
    }
  }, [curExecTimes]);

  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
  };

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
    <Drawer title="节点执行结果" width={800} onClose={onClose} open={props.open}>
      <div>
        {maxExecTimes > 1 && (
          <Form>
            <Form.Item label="执行次数（倒数第几次）">
              <InputNumber
                min={1}
                max={maxExecTimes}
                defaultValue={1}
                onChange={(e) => {
                  setCurExecTimes(e - 1);
                }}
              />
            </Form.Item>
          </Form>
        )}
        <b style={{ color: resultTextColor }}>执行结果：{resultText}</b>
        <br />
        <p style={{ marginTop: 10 }}>执行时间：{execTime}</p>
        {preStepExecResult?.assertResultVo?.pass === false && (
          <Collapse size="small" defaultActiveKey={['1']} style={{ marginTop: 10 }}>
            <Panel header="失败断言：" key="1">
              <List
                style={{ marginBottom: 5 }}
                size="small"
                bordered
                dataSource={preStepExecResult?.assertResultVo?.message}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Panel>
          </Collapse>
        )}
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{ marginTop: 10, height: 500 }}
        >
          <ProCard.TabPane key="tab1" tab="输出参数">
            <Paragraph>
              <div style={divStyle}>
                <pre style={preStyle}>{JSON.stringify(outputParams, null, 2)}</pre>
              </div>
            </Paragraph>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="Groovy脚本">
            <Paragraph>
              <div style={divStyle}>
                <pre style={preStyle}>{preStepExecResult?.groovyScript}</pre>
              </div>
            </Paragraph>
          </ProCard.TabPane>
        </ProCard>
      </div>
    </Drawer>
  );
};
export default PreStepNodeResult;
