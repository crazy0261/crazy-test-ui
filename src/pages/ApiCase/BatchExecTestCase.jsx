import { batchExec, batchQueryTestcase } from '@/services/apiCase';
// import { listAllEnvName } from '@/services/config/envinfo';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

// 批量执行测试用例
const BatchExecTestCase = () => {
  const urlParams = new URL(window.location.href).searchParams;
  const CaseIds = urlParams.get('CaseIds');
  const [data, setData] = useState([]);
  const [envList, setEnvList] = useState([]);
  const [curEnvNameId, setCurEnvNameId] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugResult, setDebugResult] = useState();
  const [pageSize, setPageSize] = useState(10);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryEnvList = () => {
    // listAllEnvName().then((result) => {
    //   if (result.code === 200) {
    //     setEnvList(result.data.map((item) => ({ value: item.id, label: item.name })));
    //   }
    // });
  };

  const queryTestcase = () => {
    batchQueryTestcase({ testcaseIds: CaseIds }).then((res) => {
      if (res.code === 200) {
        setData(res.data);
      }
    });
  };

  useEffect(() => {
    queryEnvList();
    if (CaseIds !== '') {
      queryTestcase();
    }
  }, []);

  const columns = [
    {
      title: '用例ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '用例名',
      dataIndex: 'name',
      key: 'name',
      onFilter: true,
      render: (text, record) => (
        <a href={'/apiTestCase/detail?id=' + record.id} target={'_blank'} rel={'noreferrer'}>
          {text}
        </a>
      ),
    },
    {
      title: '执行结果',
      key: 'status',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        INIT: {
          text: '未开始',
          status: 'Default',
        },
        SUCCESS: {
          text: '执行成功',
          status: 'Success',
        },
        FAILE: {
          text: '执行失败',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          size={'small'}
          type="primary"
          disabled={record.status === 'INIT'}
          onClick={() => {
            try {
              setDebugResult(record.debugResultVo);
              showModal();
            } catch {
              message.error('【用例执行异常】' + record.debugResultVo);
            }
          }}
        >
          查看结果
        </Button>
      ),
    },
  ];

  useEffect(() => {}, []);

  return (
    <div>
      <ProTable
        dataSource={data}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="用例列表"
        toolBarRender={() => [
          <Select
            key="selectEnv"
            style={{ width: 120, marginRight: 10 }}
            options={envList}
            onChange={(e) => {
              setCurEnvNameId(e);
            }}
            placeholder="执行环境"
          />,
          <Button
            type="primary"
            key="batchExec"
            loading={loading}
            onClick={() => {
              if (curEnvNameId === undefined) {
                message.warning('请选择环境');
              } else {
                setLoading(true);
                batchExec({ envNameId: curEnvNameId, testcaseIds: CaseIds }).then((res) => {
                  setLoading(false);
                  if (res.code === 200) {
                    setData(res.data);
                  }
                });
              }
            }}
          >
            批量执行
          </Button>,
        ]}
      />
      <Modal
        title="用例执行结果"
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* <CaseResult debugResult={debugResult} /> */}
      </Modal>
    </div>
  );
};

export default BatchExecTestCase;
