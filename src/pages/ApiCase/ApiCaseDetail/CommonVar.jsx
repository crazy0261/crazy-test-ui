/*
 * @Author: Menghui
 * @Date: 2025-03-15 16:41:19
 * @LastEditTime: 2025-04-10 21:15:17
 * @Description:  公共变量信息
 */
import { ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';

const CommonVar = (props) => {
  const tableListDataSource = [
    {
      describe: '当前时间戳(毫秒)',
      commonVar: '${__timestamp__}',
      example: '1686819577876',
    },
    {
      describe: '当前时间戳(秒)',
      commonVar: '${__timestamp_second__}',
      example: '1728921383',
    },
    {
      describe: '当前时间',
      commonVar: '${__current_time__}',
      example: '2025-03-13 11:20:10',
    },
    {
      describe: '当前日期',
      commonVar: '${__current_date__}',
      example: '2025-03-13',
    },
    {
      describe: 'token',
      commonVar: '${token}',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEsIm5hbWUiOiLnrqHnkIblkZgiLCJ0ZW5hbnRJZCI6IjEiLCJpZCI6MSwiZXhwIjoxNzQzMDk4NzkzLCJpYXQiOjE3NDMwODQzOTMsImFjY291bnQiOiJhZG1pbiJ9.uRRdNzalx-cHKtx6oiUHu071fNUHYJ1p-h9cX0LdHxs',
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
