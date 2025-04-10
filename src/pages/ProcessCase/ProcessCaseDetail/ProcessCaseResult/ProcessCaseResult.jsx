/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:53:14
 * @LastEditTime: 2025-04-10 22:30:24
 * @Description:
 */
// import EnvVarComponent from '@/pages/ApiTestCaseDetail/EnvVarComponent';
// import { listAll as listAllTestAccount } from '@/services/config/testAccount';
import { ProCard } from '@ant-design/pro-components';
import { Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

// 开始节点结果页
const ProcessCaseResult = (props) => {
  const [color, setColor] = useState('black');
  const { Paragraph } = Typography;
  const [testAccountList, setTestAccountList] = useState([]);

  // 查询测试账号列表
  const queryTestAccountList = () => {
    // listAllTestAccount().then((result) => {
    //   if (result.code === 200) {
    //     setTestAccountList(result.data.map((item) => ({ value: item.id, label: item.name })));
    //   } else {
    //     message.error('查询测试账号列表失败');
    //   }
    // });
  };

  // 首次进入页面
  useEffect(() => {
    queryTestAccountList();
  }, []);

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

  return (
    <Drawer title="用例执行结果" width={800} onClose={onClose} open={props.open}>
      <div>
        <b style={{ color: color, marginRight: 30 }}>执行结果：{props.caseStatus}</b>
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{ marginTop: 10, height: 500 }}
        >
          <ProCard.TabPane key="tab1" tab="用例入参">
            {/* <EnvVarComponent
              dataSource={props.inputParams?.['envVariables']}
              testAccount={props.inputParams?.['testaccountID']}
              isEdit={false}
              needTestAccount={true}
            /> */}
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
