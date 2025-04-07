/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:56:28
 * @LastEditTime: 2025-04-01 00:00:23
 * @Description:
 */
import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

const StartNode = ({ data }) => {
  const color = data.color === undefined ? 'white' : data.color;
  const borderColor = data.borderColor === undefined ? 'black' : data.borderColor;

  return (
    <div>
      <Button
        style={{
          height: 40,
          width: 150,
          backgroundColor: color,
          color: 'black',
          textAlign: 'center',
          borderColor: borderColor,
          borderStyle: 'solid',
          borderBottomLeftRadius: '2em',
          borderBottomRightRadius: '2em',
          borderTopLeftRadius: '2em',
          borderTopRightRadius: '2em',
        }}
      >
        开始
      </Button>
      <Handle type="source" position={Position.Bottom} id="4" />
    </div>
  );
};

export default StartNode;
