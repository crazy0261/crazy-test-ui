/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:53:14
 * @LastEditTime: 2025-04-20 18:11:04
 * @Description:
 */
import DebugEnvVarComponen from '@/pages/ProcessCase/ProcessCaseDetail/DebugEnvVarComponen';
import { ProCard } from '@ant-design/pro-components';
import { Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

// 开始节点结果页
const ProcessCaseResult = (props) => {
  const [color, setColor] = useState('black');
  const { Paragraph } = Typography;
  const [env, setEnv] = useState([]);

  useEffect(() => {
    if (props.caseStatus === 'FAILE' || props.caseStatus === 'TIMEOUT') {
      setColor('red');
    } else if (props.caseStatus === 'SUCCESS') {
      setColor('green');
    } else if (props.caseStatus === 'INIT') {
      setColor('gray');
    } else {
      setColor('black');
    }
  }, [props.caseStatus]);

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

  const statusConfig = {
    SUCCESS: { color: 'green', text: '成功' },
    FAILED: { color: 'red', text: '失败' },
    TIMEOUT: { color: 'orange', text: '超时' },
  };

  return (
    <Drawer title="用例执行结果" width={800} onClose={onClose} open={props.open}>
      <div>
        <b style={{ color: statusConfig[props.caseStatus].color, marginRight: 30 }}>
          执行结果：{statusConfig[props.caseStatus].text}
        </b>
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{ marginTop: 10, height: 500 }}
        >
          <ProCard.TabPane key="tab1" tab="用例入参">
            <DebugEnvVarComponen
              dataSource={env}
              setDataSource={setEnv}
              testAccount={props.testAccount}
              isEdit={false}
              needTestAccount={true}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="用例出参">
            <Paragraph>
              <div style={divStyle}>
                <pre style={preStyle}>{JSON.stringify(props.outputParams, null, 2)}</pre>
              </div>
            </Paragraph>
          </ProCard.TabPane>
        </ProCard>
      </div>
    </Drawer>
  );
};
export default ProcessCaseResult;
