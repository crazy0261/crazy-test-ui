// import { queryByResultIdAndNodeId } from '@/services/mulTestcaseResultNode';
import { ProCard } from '@ant-design/pro-components';
import { Button, Drawer, Form, InputNumber, Typography } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

// 子流程节点结果页
const SubProcessResult = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');
  const [color, setColor] = useState('black');
  const { Paragraph } = Typography;
  const [outputParams, setOutputParams] = useState({});
  const [subProcessInputParams, setSubProcessInputParams] = useState({});
  const [subResultId, setSubResultId] = useState();
  const [subProcessStatus, setSubProcessStatus] = useState();
  const [res, setRes] = useState();
  const [maxExecTimes, setMaxExecTimes] = useState(0);
  const [curExecTimes, setCurExecTimes] = useState(0);

  useEffect(() => {
    // if (props.open === true && props.curNodeId !== undefined && id !== undefined) {
    //   queryByResultIdAndNodeId({ resultId: id, nodeId: props.curNodeId }).then((res) => {
    //     if (res.code === 200 && res.data !== null) {
    //       setRes(res);
    //       setMaxExecTimes(res.data.length);
    //       setCurExecTimes(res.data.length - 1);
    //       if (res.data.length === 1) {
    //         setSubResultId(res.data[0].subResultId);
    //         setOutputParams(JSONbig.parse(res.data[0].outputParams));
    //         setSubProcessStatus(res.data[0].status);
    //         setSubProcessInputParams(JSONbig.parse(res.data[0].subProcessInputParams));
    //       }
    //     } else {
    //       setSubResultId();
    //       setOutputParams({});
    //       setSubProcessStatus();
    //       setSubProcessInputParams({});
    //     }
    //   });
    // }
  }, [props.curNodeId, props.open]);

  useEffect(() => {
    if (res !== undefined && res !== null && res.data.length > 0) {
      setSubResultId(res.data[curExecTimes].subResultId);
      setOutputParams(JSONbig.parse(res.data[curExecTimes].outputParams));
      setSubProcessStatus(res.data[curExecTimes].status);
    }
  }, [curExecTimes]);

  useEffect(() => {
    if (subProcessStatus === 'FAILE' || subProcessStatus === 'TIMEOUT') {
      setColor('red');
    } else if (subProcessStatus === 'SUCCESS') {
      setColor('green');
    } else if (subProcessStatus === 'INIT') {
      setColor('gray');
    } else {
      setColor('black');
    }
  }, [subProcessStatus]);

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
    <Drawer title="子流程结果概览" width={800} onClose={onClose} open={props.open}>
      <div>
        {maxExecTimes > 1 && (
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item label="执行次数（倒数第几次）：">
              <InputNumber
                min={1}
                max={maxExecTimes}
                defaultValue={maxExecTimes}
                onChange={(e) => {
                  setCurExecTimes(e - 1);
                }}
              />
            </Form.Item>
          </Form>
        )}
        <b style={{ color: color, marginRight: 30 }}>子流程状态：{subProcessStatus}</b>
        <Button
          type="primary"
          onClick={() => {
            window.open('/mulTestCase/detail/debug?id=' + subResultId);
          }}
          disabled={subResultId === undefined}
        >
          查看详情
        </Button>
        <br />
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{ marginTop: 10, height: 500 }}
        >
          <ProCard.TabPane key="tab1" tab="子流程出参">
            <Paragraph>
              <div style={divStyle}>
                <pre style={preStyle}>{JSON.stringify(outputParams, null, 2)}</pre>
              </div>
            </Paragraph>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="子流程入参">
            <Paragraph>
              <div style={divStyle}>
                <pre style={preStyle}>{JSON.stringify(subProcessInputParams, null, 2)}</pre>
              </div>
            </Paragraph>
          </ProCard.TabPane>
        </ProCard>
      </div>
    </Drawer>
  );
};
export default SubProcessResult;
