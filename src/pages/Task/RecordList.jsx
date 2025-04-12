import { queryRecord, updateScheduleStatus } from '@/services/task';
import { FileSearchOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button } from 'antd';
import { useRef, useState } from 'react';

// 定时任务执行记录列表
const RecordList = () => {
  const path = new URL(window.location.href).pathname;
  const scheduleId = Number.parseInt(path.split('/').pop());
  const actionRef = useRef();
  const [pageSize, setPageSize] = useState(5);

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '任务名称',
      dataIndex: 'scheduleName',
      ellipsis: true,
      search: false,
    },
    {
      title: '批次号',
      dataIndex: 'scheduleBatchId',
      ellipsis: true,
      search: false,
      render: (text, record) => (
        <a
          onClick={() => {
            history.push('/schedule/result/' + scheduleId + '/' + record.scheduleBatchId);
          }}
        >
          {record.scheduleBatchId}
        </a>
      ),
    },
    {
      title: '执行环境',
      dataIndex: 'envName',
      ellipsis: true,
      search: false,
      width: 120,
    },
    {
      title: '执行结果',
      dataIndex: 'status',
      ellipsis: true,
      width: 120,
      search: false,
      valueEnum: {
        INIT: { text: '初始化', status: 'Default' },
        RUNNING: { text: '执行中', status: 'Processing' },
        SUCCESS: { text: '执行成功', status: 'Success' },
        FAILE: { text: '执行失败', status: 'Error' },
        INTERRUPT: { text: '中断', status: 'Error' },
        TIMEOUT: { text: '超时', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      search: false,
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 80,
      render: (text, record, _, action) => [
        <div key="detail">
          <Button
            icon={<FileSearchOutlined />}
            size={'small'}
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              history.push('/schedule/result/' + scheduleId + '/' + record.scheduleBatchId);
            }}
          />
          {/* <Tooltip key="show1" title="中断">
            <Button
              icon={<StopTwoTone />}
              size={'small'}
              onClick={() => {
                interrupt({ id: scheduleId, scheduleBatchId: record.scheduleBatchId }).then(
                  (res) => {
                    console.log('res=', res);
                    if (res.code === 200) {
                      message.success('已中断');
                      actionRef.current.reload();
                    }
                  },
                );
              }}
            />
          </Tooltip> */}
        </div>,
      ],
    },
  ];

  return (
    <div>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="执行记录"
        request={async (params = {}, sort, filter) => {
          updateScheduleStatus();
          if (scheduleId) {
            return queryRecord({ ...params, scheduleId: scheduleId });
          }
        }}
        toolBarRender={() => []}
      />
    </div>
  );
};

export default RecordList;
