/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:55:42
 * @LastEditTime: 2025-04-01 00:01:03
 * @Description:
 */
import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

const EndNode = ({ data }) => {
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
        结束
      </Button>
      <Handle type="target" position={Position.Top} id="1" />
    </div>
  );
};

export default EndNode;
