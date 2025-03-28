import CaseResult from '@/pages/ApiCase/ApiCaseDetail/CaseResult';
import { queryApiCaseExecLog } from '@/services/apiCase';

// import { queryMulCaseExecLog } from '@/services/mulTestcaseResult';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useRef, useState } from 'react';

// 用例执行记录
const ExecLog = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApiCaseResModalOpen, setIsApiCaseResModalOpen] = useState(false);
  const [debugResult, setDebugResult] = useState();
  const [envName, setEnvName] = useState();

  useEffect(() => {
    if (props.open) {
      actionRef?.current?.reload();
    }
  }, [props.open]);

  const queryExecLog = () => {
    if (props.caseType === 'mulCase') {
      // return queryMulCaseExecLog({
      //   caseId: props.caseId,
      //   current: currentPage,
      //   pageSize: pageSize,
      // });
    } else if (props.caseType === 'apiCase') {
      return queryApiCaseExecLog({
        apiTestcaseId: props.apiTestcaseId,
        current: currentPage,
        pageSize: pageSize,
      });
    } else {
      message.error('查询用例执行记录，不支持的用例类型：' + props.caseType);
    }
  };

  const handleOk = () => {
    setCurrentPage(1);
    actionRef.current.reload();
    props.setOpen(false);
  };
  const handleCancel = () => {
    setCurrentPage(1);
    props.setOpen(false);
  };

  const actionRef = useRef();

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '执行环境',
      dataIndex: 'envName',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 90,
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
      title: '批次号',
      tooltip: '最后一位为标识符：0-定时任务',
      dataIndex: 'scheduleBatchId',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 60,
      render: (text, record, _, action) => [
        <div key="detail">
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              if (props.caseType === 'mulCase') {
                window.open('/mulTestCase/detail/debug?id=' + record.id);
              } else {
                setIsApiCaseResModalOpen(true);
                setDebugResult(JSONbig.parse(record.debugResult));
                setEnvName(record.envName);
              }
            }}
          >
            详情
          </Button>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <Modal
        width={700}
        title={'用例执行记录：' + props.caseName}
        open={props.open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={() => queryExecLog()}
          pagination={{
            showSizeChanger: true,
            pageSize: pageSize,
            onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
            onChange: (e) => {
              setCurrentPage(e);
            },
            current: currentPage,
          }}
          editable={{
            type: 'multiple',
          }}
          rowKey="id"
          options={false}
          search={false}
          dateFormatter="string"
        />
      </Modal>
      <Modal
        title="用例执行结果"
        width={800}
        open={isApiCaseResModalOpen}
        onOk={() => setIsApiCaseResModalOpen(false)}
        onCancel={() => setIsApiCaseResModalOpen(false)}
        style={{
          top: 10,
        }}
      >
        <CaseResult debugResult={debugResult} envName={envName} />
      </Modal>
    </div>
  );
};

export default ExecLog;
