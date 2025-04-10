import { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, { addEdge, Background, Controls, MarkerType, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import ConditionNode from './customNode/ConditionNode';
import EndNode from './customNode/EndNode';
import PreStepNode from './customNode/PreStepNode';
import SqlNode from './customNode/SqlNode';
import StartNode from './customNode/StartNode';
import SubProcessNode from './customNode/SubProcessNode';
import TestCaseNode from './customNode/TestCaseNode';
import EditCaseNode from './EditCaseNode';
import EditConditionNode from './EditConditionNode';
import EditEdge from './EditEdge';
import EditPreStepNode from './EditPreStepNode';
import EditSqlNode from './EditSqlNode';
import EditSubProcess from './EditSubProcess';
import EditTestCase from './EditTestCase';
import './index.scss';
import ConditionNodeResult from './ProcessCaseResult/ConditionNodeResult';
import NodeResult from './ProcessCaseResult/NodeResult';
import PreStepNodeResult from './ProcessCaseResult/PreStepNodeResult';
import MulCaseResult from './ProcessCaseResult/ProcessCaseResult';
import SubProcessResult from './ProcessCaseResult/SubProcessResult';
import Sidebar from './Sidebar';

const ProcessCaseDetail = (props) => {
  const nodeTypes = useMemo(
    () => ({
      TestCaseNode: TestCaseNode,
      StartNode: StartNode,
      EndNode: EndNode,
      ConditionNode: ConditionNode,
      SubProcessNode: SubProcessNode,
      PreStepNode: PreStepNode,
      SqlNode: SqlNode,
    }),
    [],
  );
  const isDebug = window.location.href.indexOf('/debug') !== -1;
  const [curNodeId, setCurNodeId] = useState();
  const [copyNodeId, setCopyNodeId] = useState();
  const [curEdgeId, setCurEdgeId] = useState();
  const [curNodeType, setCurNodeType] = useState();
  const [editTestCaseOpen, setEditTestCaseOpen] = useState(false);
  const [editCaseNodeOpen, setEditCaseNodeOpen] = useState(false);
  const [editConditionNode, setEditConditionNode] = useState(false);
  const [editPreStepNode, setEditPreStepNode] = useState(false);
  const [nodeResultOpen, setNodeResultOpen] = useState(false);
  const [editEdgeOpen, setEditEdgeOpen] = useState(false);
  const [mulcaseResultOpen, setMulcaseResultOpen] = useState(false);
  const [subProcessOpen, setSubProcessOpen] = useState(false);
  const [subProcessResultOpen, setSubProcessResultOpen] = useState(false);
  const [editSqlNodeOpen, setEditSqlNodeOpen] = useState(false);
  const [conditionNodeResultOpen, setConditionNodeResultOpen] = useState(false);
  const [preStepNodeResultOpen, setPreStepNodeResultOpen] = useState(false);
  const [sqlNodeResultOpen, setSqlNodeResultOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [edgeInfo, setEdgeInfo] = useState({});
  const [nodeShow, setNodeShow] = useState(true);
  const [outputParams, setOutputParams] = useState({});
  const [inputParams, setInputParams] = useState({});
  const [caseStatus, setCaseStatus] = useState('INIT');

  // 添加连接线
  const onConnect = useCallback((params) => {
    const markerEnd = {
      type: MarkerType.ArrowClosed,
    };
    params.markerEnd = markerEnd;
    params.type = 'smoothstep';
    props.setEdges((eds) => addEdge(params, eds));
  }, []);

  // 节点拖拽时
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 添加新节点
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Date.now().toString(),
        type,
        position,
        data: { label: `${type} node` },
      };
      props.setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  // 点击节点
  const onNodeClick = (e, node) => {
    console.log('点击节点', node);
    setCurNodeId(node.id);
    setCurNodeType(node?.type);
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === node.id) {
        props.nodes[i]['data']['borderColor'] = 'orange';
      }
    }
    console.log('node?.type-------->', node?.type);
    console.log('isDebug-------->', isDebug);
    if (node?.type === 'StartNode' || node?.type === 'EndNode') {
      if (isDebug) {
        setMulcaseResultOpen(true);
      } else {
        setEditTestCaseOpen(true);
      }
    } else if (node?.type === 'TestCaseNode') {
      if (isDebug) {
        setNodeResultOpen(true);
      } else {
        setEditCaseNodeOpen(true);
      }
    } else if (node?.type === 'SubProcessNode') {
      if (isDebug) {
        setSubProcessResultOpen(true);
      } else {
        setSubProcessOpen(true);
      }
    } else if (node?.type === 'ConditionNode') {
      if (isDebug) {
        setConditionNodeResultOpen(true);
      } else {
        setEditConditionNode(true);
      }
    } else if (node?.type === 'PreStepNode') {
      if (isDebug) {
        setPreStepNodeResultOpen(true);
      } else {
        setEditPreStepNode(true);
      }
    } else if (node?.type === 'SqlNode') {
      if (isDebug) {
        setSqlNodeResultOpen(true);
      } else {
        setEditSqlNodeOpen(true);
      }
    }
    // setNodeInfo({
    //   ...node.data,
    //   id: node.id,
    //   nodeBg: node.style && node.style.background ? node.style.background : '#ffffff',
    // });
    // setNodeShow(true);
  };

  // 点击节点连接线
  const onEdgeClick = (e, edge) => {
    // console.log('点击连接线', edge); // edge拿不到完整的数据?
    for (let i = 0; i < props.nodes.length; i++) {
      if (
        props.nodes[i]['id'] === edge.source &&
        props.nodes[i].type === 'ConditionNode' &&
        !isDebug
      ) {
        setEditEdgeOpen(true);
      }
    }
    setEdgeInfo(props.edges.find((item) => edge.id === item.id));
    setNodeShow(false);
    setCurEdgeId(edge.id);
  };

  // 改变节点内容
  const changeNode = (val) => {
    props.setNodes((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.data = val;
          item.hidden = val.isHidden;
          item.style = { background: val.nodeBg };
        }
        return item;
      }),
    );
  };

  // 改变连接线内容
  const changeEdge = (val) => {
    props.setEdges((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.label = val.label;
          item.type = val.type;
          item.style = { stroke: val.color };
        }
        return item;
      }),
    );
  };

  return (
    <div className="dndflow" style={{ height: '95%' }}>
      <ReactFlowProvider>
        {!isDebug && <Sidebar />}
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={props.nodes}
            edges={props.edges}
            nodeTypes={nodeTypes}
            onNodesChange={props.onNodesChange}
            onEdgesChange={props.onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      <EditTestCase
        open={editTestCaseOpen}
        setOpen={setEditTestCaseOpen}
        nodes={props.nodes}
        edges={props.edges}
        curNodeId={curNodeId}
        setNodes={props.setNodes}
        setEdges={props.setEdges}
        setCaseName={props.setCaseName}
        setEnvName={props.setEnvName}
        setCaseId={props.setCaseId}
        setOutputParams={setOutputParams}
        setInputParams={setInputParams}
        setCaseStatus={setCaseStatus}
        align={props.align}
      />
      <EditCaseNode
        open={editCaseNodeOpen}
        setOpen={setEditCaseNodeOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
        edges={props.edges}
        setNodes={props.setNodes}
        setEdges={props.setEdges}
        copyNodeId={copyNodeId}
        setCopyNodeId={setCopyNodeId}
        align={props.align}
        moveDown={props.moveDown}
        moveUp={props.moveUp}
      />
      <NodeResult
        open={nodeResultOpen}
        setOpen={setNodeResultOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
      />
      <MulCaseResult
        open={mulcaseResultOpen}
        setOpen={setMulcaseResultOpen}
        curNodeId={curNodeId}
        outputParams={outputParams}
        inputParams={inputParams}
        caseStatus={caseStatus}
        nodes={props.nodes}
        curNodeType={curNodeType}
      />
      <EditSubProcess
        open={subProcessOpen}
        setOpen={setSubProcessOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
        edges={props.edges}
        copyNodeId={copyNodeId}
        setCopyNodeId={setCopyNodeId}
        align={props.align}
        moveDown={props.moveDown}
        moveUp={props.moveUp}
      />
      <EditSqlNode
        open={editSqlNodeOpen}
        setOpen={setEditSqlNodeOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
        edges={props.edges}
        copyNodeId={copyNodeId}
        setCopyNodeId={setCopyNodeId}
        align={props.align}
        moveDown={props.moveDown}
        moveUp={props.moveUp}
      />
      <SubProcessResult
        open={subProcessResultOpen}
        setOpen={setSubProcessResultOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
      />
      {/* <SqlNodeResult
        open={sqlNodeResultOpen}
        setOpen={setSqlNodeResultOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
      /> */}
      <ConditionNodeResult
        open={conditionNodeResultOpen}
        setOpen={setConditionNodeResultOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
      />
      <PreStepNodeResult
        open={preStepNodeResultOpen}
        setOpen={setPreStepNodeResultOpen}
        curNodeId={curNodeId}
        nodes={props.nodes}
      />
      <EditConditionNode
        open={editConditionNode}
        setOpen={setEditConditionNode}
        curNodeId={curNodeId}
        nodes={props.nodes}
        edges={props.edges}
        copyNodeId={copyNodeId}
        setCopyNodeId={setCopyNodeId}
        align={props.align}
        moveDown={props.moveDown}
        moveUp={props.moveUp}
      />
      <EditPreStepNode
        open={editPreStepNode}
        setOpen={setEditPreStepNode}
        curNodeId={curNodeId}
        nodes={props.nodes}
        edges={props.edges}
        copyNodeId={copyNodeId}
        setCopyNodeId={setCopyNodeId}
        align={props.align}
        moveDown={props.moveDown}
        moveUp={props.moveUp}
      />
      <EditEdge
        open={editEdgeOpen}
        setOpen={setEditEdgeOpen}
        curEdgeId={curEdgeId}
        nodes={props.nodes}
        edges={props.edges}
        align={props.align}
      />
    </div>
  );
};

export default ProcessCaseDetail;
