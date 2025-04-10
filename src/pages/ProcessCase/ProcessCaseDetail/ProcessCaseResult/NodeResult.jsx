/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:53:02
 * @LastEditTime: 2025-04-01 00:04:16
 * @Description:
 */
// import CaseResult from '@/pages/ApiTestCaseDetail/CaseResult';
// import { queryByResultIdAndNodeId } from '@/services/mulTestcaseResultNode';
import { Drawer, Form, InputNumber } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useState } from 'react';

// 用例节点结果页
const NodeResult = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');
  const [debugResult, setDebugResult] = useState({});
  const [outputParams, setOutputParams] = useState({});
  const [res, setRes] = useState();
  const [maxExecTimes, setMaxExecTimes] = useState(0);
  const [curExecTimes, setCurExecTimes] = useState(0);

  useEffect(() => {
    // if (props.open === true && props.curNodeId !== undefined && id !== undefined) {
    //   queryByResultIdAndNodeId({ resultId: id, nodeId: props.curNodeId }).then((res) => {
    //     if (res.code === 200 && res.data !== null && res.data.length > 0) {
    //       setRes(res);
    //       setMaxExecTimes(res.data.length);
    //       setCurExecTimes(0);
    //       if (res.data.length > 0) {
    //         setDebugResult(JSONbig.parse(res.data[0]?.debugResult));
    //         setOutputParams(JSONbig.parse(res.data[0]?.outputParams));
    //       } else {
    //         setDebugResult({});
    //         setOutputParams({});
    //       }
    //     } else {
    //       setDebugResult({});
    //       setOutputParams({});
    //     }
    //   });
    // }
  }, [props.curNodeId, props.open]);

  useEffect(() => {
    if (res !== undefined && res !== null && res.data.length > 0) {
      setDebugResult(JSONbig.parse(res.data[curExecTimes]?.debugResult));
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

  return (
    <Drawer title="节点执行结果" width={800} onClose={onClose} open={props.open}>
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
      {/* <CaseResult debugResult={debugResult} outputParams={outputParams} /> */}
    </Drawer>
  );
};
export default NodeResult;
