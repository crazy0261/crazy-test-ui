/*
 * @Author: Menghui
 * @Date: 2025-03-15 16:41:19
 * @LastEditTime: 2025-04-13 19:30:09
 * @Description: 公共变量信息
 */
import { ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

const CommonVar = (props) => {
  const [tableListDataSource, setTableListDataSource] = useState([
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
  ]);

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

  // 动态生成当前时间并更新数据源
  useEffect(() => {
    const now = new Date(); // 获取当前时间

    // 更新时间戳（毫秒）
    const timestamp = now.getTime();

    // 更新时间戳（秒）
    const timestampSecond = Math.floor(now.getTime() / 1000);

    // 更新当前时间（格式化）
    const currentTime = now
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '-'); // 替换 / 为 -

    // 更新当前日期（格式化）
    const currentDate = now
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-'); // 替换 / 为 -

    // 更新数据源
    const updatedDataSource = tableListDataSource.map((item) => {
      switch (item.commonVar) {
        case '${__timestamp__}':
          return { ...item, example: timestamp.toString() };
        case '${__timestamp_second__}':
          return { ...item, example: timestampSecond.toString() };
        case '${__current_time__}':
          return { ...item, example: currentTime };
        case '${__current_date__}':
          return { ...item, example: currentDate };
        default:
          return item;
      }
    });

    // 更新状态
    setTableListDataSource(updatedDataSource);
  }, []); // 仅在组件第一次渲染时执行

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
          dataSource={tableListDataSource} // 使用动态更新的数据源
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
