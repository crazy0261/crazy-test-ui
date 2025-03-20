import { createToken, deleteTestAccount, listPage } from '@/services/testAccountManagement';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  PlayCircleTwoTone,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal as model, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddOrUpdateTestAccountManagement from './AddOrUpdateTestAccountManagement';
import RelateCaseList from './RelateCaseList';

/**
 * 测试账号列表页
 */
const TestAccountList = () => {
  const actionRef = useRef();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [isRelateCaseModalOpen, setIsRelateCaseModalOpen] = useState(false);
  const [testAccountId, setTestAccountId] = useState(null);

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '账号',
      dataIndex: 'account',
      ellipsis: true,
      width: 200,
    },
    {
      title: '用例名称',
      dataIndex: 'apiCaseName',
      ellipsis: true,
      search: false,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'genTokenStatus',
      ellipsis: true,
      search: true,
      valueType: 'select',
      width: 60,
      valueEnum: {
        SUCCESS: {
          text: '成功',
          status: 'Success',
        },
        FAILE: {
          text: '失败',
          status: 'Error',
        },
      },
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      ellipsis: true,
      search: false,
      width: 200,
    },
    {
      title: '关联用例数',
      dataIndex: 'relateCaseNum',
      ellipsis: true,
      search: false,
      width: 90,
      render: (text, record) => (
        <a
          onClick={() => {
            setIsRelateCaseModalOpen(true);
            setTestAccountId(record.id);
          }}
        >
          {record.relateCaseNum}
        </a>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'creatorName',
      ellipsis: true,
      search: false,
      width: 80,
    },
    {
      title: '修改者',
      dataIndex: 'menderName',
      ellipsis: true,
      search: false,
      width: 80,
    },
    {
      title: '更新时间',
      dataIndex: 'modifyTime',
      copyable: false,
      ellipsis: true,
      search: false,
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 110,
      fixed: 'right',
      render: (text, record, _, action) => [
        <div key="edit">
          <Button
            icon={<EditTwoTone />}
            onClick={() => {
              setRecord(record);
              setIsAddModalOpen(true);
            }}
            size={'small'}
          ></Button>
        </div>,
        <div key="genToken">
          <Tooltip title="生成token">
            <Button
              icon={<PlayCircleTwoTone />}
              onClick={() => {
                createToken({ id: record.id }).then((res) => {
                  if (res.code === 200) {
                    message.success('执行成功');
                    actionRef.current.reload();
                  }
                });
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="delete">
          <Button
            icon={<DeleteTwoTone />}
            onClick={() => showDeleteConfirm(record.id)}
            size={'small'}
          />
        </div>,
      ],
    },
  ];

  const showDeleteConfirm = (id) => {
    model.confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleFilled />,
      content: '一旦删除将无法恢复',
      okType: 'danger',
      onOk() {
        deleteTestAccount({ id: id }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            actionRef.current.reload();
          }
        });
      },
      onCancel() {},
    });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          return listPage(params);
        }}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 1300 }}
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
        pagination={{
          showSizeChanger: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
        dateFormatter="string"
        headerTitle="账号列表"
        toolBarRender={() => [
          <Button
            onClick={() => {
              setRecord(null);
              setIsAddModalOpen(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <AddOrUpdateTestAccountManagement
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
      />
      <RelateCaseList
        open={isRelateCaseModalOpen}
        setOpen={setIsRelateCaseModalOpen}
        testAccountId={testAccountId}
      />
    </div>
  );
};

export default TestAccountList;
