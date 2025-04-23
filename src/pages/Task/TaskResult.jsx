import CaseResult from '@/pages/ApiCase/ApiTestCaseDetail/CaseResult';
import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { execRetry, queryRecordDetail, queryRecordStatistics } from '@/services/task';
import { FileSearchOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import {
  Badge,
  Breadcrumb,
  Button,
  Descriptions,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
} from 'antd';
import JSONbig from 'json-bigint';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const TaskResult = () => {
  const actionRef = useRef();
  const [scheduleName, setScheduleName] = useState();
  const path = new URL(window.location.href).pathname;
  const scheduleBatchId = Number.parseInt(path.split('/').at(-1));
  const scheduleId = Number.parseInt(path.split('/').at(-2));
  const scheduleDetailHref = '/schedule/detail/' + scheduleId;
  const [envName, setEnvName] = useState();
  const [statusText, setStatusText] = useState();
  const [statusIcon, setStatusIcon] = useState();
  const [totalCount, setTotalCount] = useState();
  const [successCount, setSuccessCount] = useState();
  const [failCount, setFailCount] = useState();
  const [runningCount, setRunningCount] = useState();
  const [initCount, setInitCount] = useState();
  const [ignoreCount, setIgnoreCount] = useState();
  const [timeoutCount, setTimeoutCount] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugResult, setDebugResult] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [userList, setUserList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const requestUserList = () => {
    listAllUser().then((result) => {
      if (result.code === 200) {
        setUserList(result.data.map((item) => ({ value: item.id, label: item.name })));
      }
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const initData = () => {
    if (scheduleBatchId) {
      queryRecordStatistics({ scheduleId: scheduleId, scheduleBatchId: scheduleBatchId }).then(
        (res) => {
          if (res.code === 200) {
            setScheduleName(res.data.scheduleName);
            setEnvName(res.data.envName);
            setTotalCount(res.data.totalCount);
            setSuccessCount(res.data.successCount);
            setFailCount(res.data.failCount);
            setRunningCount(res.data.runningCount);
            setInitCount(res.data.initCount);
            setTimeoutCount(res.data.timeoutCount);
            setIgnoreCount(res.data.ignoreCount);
            switch (res.data.status) {
              case 'INIT':
                {
                  setStatusText('初始化');
                  setStatusIcon('default');
                }
                break;
              case 'RUNNING':
                {
                  setStatusText('执行中');
                  setStatusIcon('processing');
                }
                break;
              case 'SUCCESS':
                {
                  setStatusText('执行成功');
                  setStatusIcon('success');
                }
                break;
              case 'FAILE':
                {
                  setStatusText('执行失败');
                  setStatusIcon('error');
                }
                break;
            }
          }
        },
      );
    }
  };

  useEffect(() => {
    initData();
    requestUserList();
  }, []);

  const columns = [
    {
      title: '用例名称',
      dataIndex: 'testcaseName',
      hideInTable: false,
      search: true,
      render: (text, record) => (
        <a
          href={
            record.nodes !== undefined && record.nodes !== null
              ? '/mulTestCase/detail?id=' + record.testcaseId
              : '/apiTestCase/detail?id=' + record.apiTestcaseId
          }
          target={'_blank'}
          rel={'noreferrer'}
        >
          {text}
        </a>
      ),
    },
    {
      title: '用例类型',
      dataIndex: 'caseType',
      hideInTable: false,
      width: 100,
      search: false,
    },
    {
      title: '负责人',
      dataIndex: 'caseOwnerName',
      hideInTable: false,
      width: 100,
      search: false,
    },
    {
      title: '作者',
      dataIndex: 'caseAuthorName',
      hideInTable: false,
      width: 100,
      search: false,
      ...getColumnSearchProps('caseAuthorName'),
    },
    {
      title: '执行次数',
      dataIndex: 'execTimes',
      hideInTable: false,
      width: 80,
      search: false,
    },
    {
      title: '执行结果',
      dataIndex: 'status',
      ellipsis: true,
      width: 100,
      search: true,
      valueEnum: {
        INIT: { text: '初始化', status: 'Default' },
        RUNNING: { text: '执行中', status: 'Processing' },
        SUCCESS: { text: '执行成功', status: 'Success' },
        FAILED: { text: '执行失败', status: 'Error' },
        IGNORE: { text: '忽略', status: 'Success' },
        TIMEOUT: { text: '超时', status: 'Error' },
      },
    },
    {
      title: '负责人',
      dataIndex: 'caseOwnerId',
      search: true,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            key="searchSelcet"
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={userList}
          ></Select>
        );
      },
    },
    {
      title: '作者',
      dataIndex: 'caseCreatorId',
      search: true,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            key="searchSelcet"
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={userList}
          ></Select>
        );
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
      width: 100,
      render: (text, record, _, action) => [
        <div key="detail">
          <Tooltip title="用例执行结果">
            <Button
              icon={<FileSearchOutlined />}
              type="primary"
              size={'small'}
              onClick={() => {
                try {
                  if (record.nodes !== undefined && record.nodes !== null) {
                    window.open('/mulTestCase/detail/debug?id=' + record.id);
                  } else {
                    setDebugResult(JSONbig.parse(record.debugResult));
                    showModal();
                  }
                } catch {
                  message.error('【用例执行异常】' + record.debugResult);
                }
              }}
            />
          </Tooltip>
        </div>,
        <div key="retry">
          <Tooltip title="重试">
            <Button
              icon={<RedoOutlined />}
              size={'small'}
              onClick={() => {
                execRetry({
                  id: scheduleId,
                  scheduleBatchId: scheduleBatchId,
                  testcaseId:
                    record.apiTestcaseId === undefined ? record.testcaseId : record.apiTestcaseId,
                  testcaseType: record.caseType,
                }).then((res) => {
                  if (res.code === 200) {
                    message.success('已发起重试');
                    actionRef.current.reload();
                  }
                });
              }}
            />
          </Tooltip>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 10 }}
        items={[
          {
            title: <a href="/schedule">定时任务列表</a>,
          },
          {
            title: <a href={scheduleDetailHref}>任务详情</a>,
          },
          {
            title: '执行结果',
          },
        ]}
      />
      <Descriptions column={6} title="定时任务执行结果">
        <Descriptions.Item label="任务名">{scheduleName}</Descriptions.Item>
        <Descriptions.Item label="批次号">{scheduleBatchId}</Descriptions.Item>
        <Descriptions.Item label="执行环境">{envName}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Badge status={statusIcon} text={statusText} />
        </Descriptions.Item>
        <Descriptions.Item label="用例总数">{totalCount}</Descriptions.Item>
        <Descriptions.Item label="成功">{successCount}</Descriptions.Item>
        <Descriptions.Item label="执行中">{runningCount}</Descriptions.Item>
        <Descriptions.Item label="初始化">{initCount}</Descriptions.Item>
        <Descriptions.Item label="忽略">{ignoreCount}</Descriptions.Item>
        <Descriptions.Item label="失败">{failCount}</Descriptions.Item>
        <Descriptions.Item label="超时">{timeoutCount}</Descriptions.Item>
      </Descriptions>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          if (scheduleBatchId) {
            initData();
            return queryRecordDetail({
              ...params,
              scheduleId: scheduleId,
              scheduleBatchId: scheduleBatchId,
            });
          }
          return null;
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {},
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
              };
            }
            return values;
          },
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
        dateFormatter="string"
        headerTitle="用例列表"
        toolBarRender={() => [
          <Button
            onClick={() => {
              execRetry({ id: scheduleId, scheduleBatchId: scheduleBatchId }).then((res) => {
                if (res.code === 200) {
                  message.success('已发起重试');
                  setStatusText('执行中');
                  setStatusIcon('processing');
                }
              });
            }}
            key="button"
            type="primary"
          >
            重跑失败用例
          </Button>,
        ]}
      />
      <Modal
        title="用例执行结果"
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{
          top: 10,
        }}
      >
        <CaseResult debugResult={debugResult} envName={envName} />
      </Modal>
    </div>
  );
};

export default TaskResult;
