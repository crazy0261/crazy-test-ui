// 画布侧边栏
const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside style={{ height: '90%' }}>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          borderColor: 'black',
          borderStyle: 'solid',
          borderBottomLeftRadius: '2em',
          borderBottomRightRadius: '2em',
          borderTopLeftRadius: '2em',
          borderTopRightRadius: '2em',
        }}
        className="dndnode input"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'StartNode');
        }}
        draggable
      >
        开始
      </div>
      <div
        style={{ borderStyle: 'dashed' }}
        className="dndnode testcase"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'PreStepNode');
        }}
        draggable
      >
        前置步骤
      </div>
      <div
        className="dndnode testcase"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'TestCaseNode');
        }}
        draggable
      >
        用例节点
      </div>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 1,
          borderLeftWidth: 8,
          borderRightWidth: 8,
        }}
        className="dndnode testcase"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'SubProcessNode');
        }}
        draggable
      >
        子流程
      </div>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 4,
          borderLeftWidth: 1,
          borderRightWidth: 1,
        }}
        className="dndnode testcase"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'SqlNode');
        }}
        draggable
      >
        SQL
      </div>
      <div
        style={{
          backgroundColor: 'gray',
          color: 'black',
          textAlign: 'center',
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: 1,
          clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          transition: '1s clip-path',
        }}
        className="dndnode testcase"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'ConditionNode');
        }}
        draggable
      >
        条件节点
      </div>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          borderColor: 'black',
          borderStyle: 'solid',
          borderBottomLeftRadius: '2em',
          borderBottomRightRadius: '2em',
          borderTopLeftRadius: '2em',
          borderTopRightRadius: '2em',
        }}
        className="dndnode output"
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart(event, 'EndNode');
        }}
        draggable
      >
        结束
      </div>
    </aside>
  );
};

export default Sidebar;
