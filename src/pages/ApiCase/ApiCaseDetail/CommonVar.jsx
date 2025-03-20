import { ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';

// 公共变量
const CommonVar = (props) => {
  const tableListDataSource = [
    {
      describe: '当前时间戳(毫秒)',
      commonVar: '${__timestamp__}',
      example: '1686819571376',
    },
    {
      describe: '当前时间戳(秒)',
      commonVar: '${__timestamp_second__}',
      example: '1724121383',
    },
    {
      describe: '当前时间',
      commonVar: '${__current_time__}',
      example: '2023-07-13 10:30:50',
    },
    {
      describe: '当前日期',
      commonVar: '${__current_date__}',
      example: '2023-07-13',
    },
    {
      describe: 'token',
      commonVar: '${token}',
      example:
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDIzMDcwNDAwMDAxNjc2MTM0MjIzNDY5MDMxNDI2Iiwib3Blbl9pZCI6IjU5NjM2NTA3NzU2NTY2OTM3NiIsImlzX3N5c3RlbSI6ImZhbHNlIiwidXNlcl9sb2dpbl9pZCI6IjIwMjMwNzA0MDAwMDE2NzYxMzQyMjM0NjkwMzE0MjYiLCJwYXJ0eUlkIjoiMjAyMzA3MDQwMDAwMTY3NjEzNDIyMzA1Nzk4OTYzMyIsInRlbmFudF9pZCI6IjIwMjAwMzE3MDAwMDEyMzk3NTY2NTk4ODY5OTE2MTgiLCJpYXQiOjE2OTE0ODAxNDl9.XbJvihW32ny457-NjV5ppvQFTjgusoIib44evvNxsW8',
    },
  ];

  const columns = [
    {
      title: '变量描述',
      dataIndex: 'describe',
      ellipsis: true,
    },
    {
      title: '变量名',
      copyable: true,
      dataIndex: 'commonVar',
      ellipsis: true,
    },
    {
      title: '示例',
      dataIndex: 'example',
      ellipsis: true,
    },
  ];

  const handleOk = () => {
    props.setIsModalOpen(false);
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title="公共变量"
        width={700}
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProTable
          columns={columns}
          request={(params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          rowKey="key"
          options={false}
          search={false}
          pagination={false}
        />
      </Modal>
    </div>
  );
};
export default CommonVar;
