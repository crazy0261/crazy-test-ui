/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:56:01
 * @LastEditTime: 2025-04-01 00:00:28
 * @Description:
 */
import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

// SQL节点
const SqlNode = ({ data }) => {
  const label = data.label === undefined ? 'SQL' : data.label;
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
          borderWidth: 4,
          borderLeftWidth: 1,
          borderRightWidth: 1,
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

export default SqlNode;
