import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

// 子流程
const SubProcessNode = ({ data }) => {
  const label = data.label === undefined ? '子流程' : data.label;
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
          borderWidth: 2,
          borderLeftWidth: 8,
          borderRightWidth: 8,
        }}
      >
        {label}
      </Button>
      <Handle type="target" position={Position.Top} id="1" />
      <Handle type="source" position={Position.Left} id="2" />
      <Handle type="source" position={Position.Right} id="3" />
      <Handle type="source" position={Position.Bottom} id="4" />
    </div>
  );
};

export default SubProcessNode;
