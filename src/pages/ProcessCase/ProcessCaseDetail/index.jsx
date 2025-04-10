import Debug from '@/pages/ApiCase/ApiCaseDetail/Debug';
import ExecLog from '@/pages/ProcessCase/ExecLog';
import { detail, save } from '@/services/processCase';
import { ClockCircleTwoTone } from '@ant-design/icons';
import { Button, Layout, Space, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';
import ProcessCaseDetail from './ProcessCaseDetail';
const { Header, Sider, Content } = Layout;

const headerStyle = {
  textAlign: 'left',
  height: 0,
  backgroundColor: 'transparent',
  marginTop: -10,
  marginRight: -20,
  justifyContent: 'right',
  alignItems: 'center',
  display: 'flex',
};

const contentStyle = {
  textAlign: 'center',
  backgroundColor: 'transparent',
};
const siderStyle = {
  textAlign: 'center',
  backgroundColor: 'transparent',
};

const App = () => {
  const isDebug = window.location.href.indexOf('/debug') !== -1;
  const [envName, setEnvName] = useState('');
  const [caseName, setCaseName] = useState('');
  const [caseId, setCaseId] = useState();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isExecLogModalOpen, setIsExecLogModalOpen] = useState(false);
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');

  const processCaseData = () => {
    detail({ id: id }).then((res) => {
      if (res.code === 200) {
        setNodes(JSON.parse(res.data.nodes));
        setEdges(JSON.parse(res.data.edges));
        setCaseName(res.data.name);
      }
    });
  };

  useEffect(() => {
    processCaseData();
    console.log('useEffect---->');
    if (isDebug) {
    }
  }, []);

  const handleSave = () => {
    align();
    save({
      id: id,
      nodes: nodes,
      edges: edges,
    }).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
      }
    });
  };

  // 纵向对齐
  const align = () => {
    let xPostion;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === 'StartNode') {
        xPostion = nodes[i].position.x - 50;
        break;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      if (
        nodes[i].type !== 'StartNode' &&
        nodes[i].type !== 'EndNode' &&
        Math.abs(nodes[i].position.x - xPostion) <= 125
      ) {
        nodes[i].position.x = xPostion;
      }
      if (nodes[i].type === 'EndNode' && Math.abs(nodes[i].position.x - xPostion - 50) <= 75) {
        nodes[i].position.x = xPostion + 50;
      }
    }
  };

  // 将当前节点及下面的节点，向下移动
  function moveDown(id) {
    let tarNodePosY;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        tarNodePosY = nodes[i].position.y;
        break;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].position.y >= tarNodePosY) {
        nodes[i].position.y = nodes[i].position.y + 60;
      }
    }
  }

  // 将当前节点及下面的节点，向上移动
  function moveUp(id) {
    let tarNodePosY;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        tarNodePosY = nodes[i].position.y;
        break;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].position.y >= tarNodePosY) {
        nodes[i].position.y = nodes[i].position.y - 60;
      }
    }
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Header style={headerStyle}>
          <Tooltip title="点击开始节点，修改用例名">
            <b style={{ marginRight: 30 }}>用例名：{caseName}</b>
          </Tooltip>
          {isDebug && <b style={{ marginRight: 30 }}>执行环境：{envName}</b>}
          <Tooltip title="执行记录">
            <Button
              style={{ marginRight: 10 }}
              type="text"
              size="large"
              icon={<ClockCircleTwoTone />}
              onClick={() => {
                setIsExecLogModalOpen(true);
              }}
            />
          </Tooltip>
          <Debug caseType="mulTestcase" isEdit={false} caseId={isDebug ? caseId : id} />
          {!isDebug && (
            <>
              <Button disabled={isDebug} type="primary" onClick={() => handleSave()}>
                保存
              </Button>
            </>
          )}
          {isDebug && (
            <Button
              type="primary"
              onClick={() => {
                window.open('/mulTestCase/detail?id=' + caseId, '_self');
              }}
            >
              编辑
            </Button>
          )}
        </Header>
        <Layout>
          <Sider style={siderStyle} width="0%"></Sider>
          <Content style={contentStyle}>
            <ProcessCaseDetail
              setEnvName={setEnvName}
              setCaseName={setCaseName}
              setCaseId={setCaseId}
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              align={align}
              moveDown={moveDown}
              moveUp={moveUp}
            />
          </Content>
        </Layout>
      </Space>
      <ExecLog
        open={isExecLogModalOpen}
        setOpen={setIsExecLogModalOpen}
        caseId={isDebug ? caseId : id}
        caseName={caseName}
        caseType="mulCase"
      />
    </div>
  );
};

export default App;
