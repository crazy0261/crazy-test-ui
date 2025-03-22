import { ClockCircleTwoTone } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';
import { useState } from 'react';
// import ExecLog from '../MulTestCase/ExecLog';
import CaseDetail from './CaseDetail';
import CaseResult from './CaseResult';
// import Debug from './Debug';

const App = () => {
  const { Sider, Content } = Layout;
  const urlParams = new URL(window.location.href).searchParams;
  const [testcaseId, setTestcaseId] = useState(urlParams.get('id'));
  const [testcaseName, setTestcaseName] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [debugResult, setDebugResult] = useState(null);
  const [domain, setDomain] = useState('-');
  const [envName, setEnvName] = useState();
  const [isExecLogModalOpen, setIsExecLogModalOpen] = useState(false);

  const contentStyle = {
    minHeight: 100,
    lineHeight: '100px',
    backgroundColor: 'transparent',
    marginRight: '10px',
  };
  const siderStyle = {
    lineHeight: '100px',
    backgroundColor: 'transparent',
  };
  return (
    <div>
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
        size={[0, 48]}
      >
        <Layout>
          <Layout>
            <Content style={contentStyle}>
              <CaseDetail
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                testcaseId={testcaseId}
                setTestcaseId={setTestcaseId}
                setTestcaseName={setTestcaseName}
                domain={domain}
              />
            </Content>
            <Sider style={siderStyle} width="40%" theme="light">
              <div style={{ marginTop: 0 }}>
                {/* <Debug
                  caseType="apiTestcase"
                  isEdit={isEdit}
                  caseId={testcaseId}
                  setDebugResult={setDebugResult}
                  setDomain={setDomain}
                  setEnvName={setEnvName}
                /> */}
              </div>
              {!isEdit && (
                <Button
                  type="primary"
                  size="small"
                  style={{ float: 'left' }}
                  icon={<ClockCircleTwoTone />}
                  onClick={() => {
                    setIsExecLogModalOpen(true);
                  }}
                >
                  执行记录
                </Button>
              )}
              <div style={{ marginLeft: 0, marginTop: 40 }}>
                <CaseResult debugResult={debugResult} envName={envName} />
              </div>
            </Sider>
          </Layout>
        </Layout>
      </Space>
      {/* <ExecLog
        open={isExecLogModalOpen}
        setOpen={setIsExecLogModalOpen}
        caseId={testcaseId}
        caseName={testcaseName}
        caseType="apiCase"
      /> */}
    </div>
  );
};

export default App;
