import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

const ConditionNode = ({ data }) => {
  const label = data.label === undefined ? '新用例节点' : data.label;
  const color = data.color === undefined ? 'white' : data.color;
  const borderColor = data.borderColor === undefined ? 'black' : data.borderColor;

  return (
    <div>
      <Button
        style={{
          height: 40,
          width: 250,
          backgroundColor: color,
          color: 'black',
          textAlign: 'center',
          borderColor: borderColor,
          borderStyle: 'solid',
          borderWidth: 3,
          clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          transition: '1s clip-path',
        }}
      >
        {label}
      </Button>
      <Handle type="target" position={Position.Top} id="1" />
      <Handle type="target" position={Position.Left} id="2" />
      <Handle type="target" position={Position.Right} id="3" />
      <Handle type="source" position={Position.Bottom} id="4" />
    </div>
  );
};

export default ConditionNode;
