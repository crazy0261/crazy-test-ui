// import { queryByResultIdAndNodeId } from '@/services/mulTestcaseResultNode';
import { ProCard } from '@ant-design/pro-components';
import { Drawer, Form, InputNumber, Typography } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

// 条件节点结果页 & 前置步骤节点结果页
const ConditionNodeResult = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');
  const { Paragraph } = Typography;
  const [res, setRes] = useState();
  const [outputParams, setOutputParams] = useState({});
  const [maxExecTimes, setMaxExecTimes] = useState(0);
  const [curExecTimes, setCurExecTimes] = useState(0);

  useEffect(() => {
    // if (props.open === true && props.curNodeId !== undefined && id !== undefined) {
    //   queryByResultIdAndNodeId({ resultId: id, nodeId: props.curNodeId }).then((res) => {
    //     if (res.code === 200 && res.data !== null) {
    //       setRes(res);
    //       setMaxExecTimes(res.data.length);
    //       setCurExecTimes(0);
    //       if (res.data.length > 0) {
    //         setOutputParams(JSONbig.parse(res.data[0]?.outputParams));
    //       } else {
    //         setOutputParams({});
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
        </ProCard>
      </div>
    </Drawer>
  );
};
export default ConditionNodeResult;
