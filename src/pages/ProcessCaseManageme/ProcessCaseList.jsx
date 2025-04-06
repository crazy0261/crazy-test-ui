import { copy, list } from '@/services/processCase';
import { listAll } from '@/services/user';
import {
  ClockCircleTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
  FileSearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Select, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { priorityEnum } from '../../common';
import AddProcessCase from './AddProcessCase';
import DeleteCase from './DeleteCase';
import DownCase from './DownCase';
import ExecLog from './ExecLog';
import ModOwner from './ModOwner';
import MoveMulTestCase from './MoveMulTestCase';
import RelateCase from './RelateCase';
import UpCase from './UpCase';

/**
 * 场景用例列表页
 */
const ProcessCaseList = (props) => {
  const [userList, setUserList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoevModalOpen] = useState(false);
  const [isExecLogModalOpen, setIsExecLogModalOpen] = useState(false);
  const [isRelateCaseModalOpen, setIsRelateCaseModalOpen] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [disableCaseOpen, setDisableCaseOpen] = useState(false);
  const [enableCaseOpen, setEnableCaseOpen] = useState(false);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState(false);
  const [modOwnerOpen, setModOwnerOpen] = useState(false);
  const [curCaseId, setCurCaseId] = useState();
  const [curCaseName, setCurCaseName] = useState();
  let cancleRowKeys = []; // 取消选择的项目
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    userAll();
  }, []);

  const userAll = () => {
    listAll().then((res) => {
      if (res.code === 200) {
        const userList = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setUserList(userList);
      }
    });
  };

  const clearSelectedCaseIds = () => {
    setSelectedCaseIds([]);
  };

  const onSelect = (record, selected) => {
    if (!selected) {
      cancleRowKeys = [record.id];
    }
  };

  const onMulSelect = (selected, selectedRows, changeRows) => {
    if (!selected) {
      cancleRowKeys = changeRows.map((item) => item.id);
    }
  };

  const onChange = (selectedRowKeys, selectedRows) => {
    if (cancleRowKeys.length) {
      const keys = selectedCaseIds.filter((item) => !cancleRowKeys.includes(item));
      setSelectedCaseIds(keys);
      cancleRowKeys = [];
    } else {
      setSelectedCaseIds([...new Set(selectedCaseIds.concat(selectedRowKeys))]);
    }
  };

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用例名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      copyable: true,
      width: 250,
      render: (text, record) => (
        <a href={'/mulTestCase/detail?id=' + record.id} target={'_blank'} rel={'noreferrer'}>
          {record.name}
        </a>
      ),
    },

    {
      title: '优先级',
      dataIndex: 'priorityDesc',
      ellipsis: true,
      width: 60,
      search: false,
      valueType: 'select',
      valueEnum: priorityEnum,
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
            setCurCaseId(record.id);
            setIsRelateCaseModalOpen(true);
            setCurCaseName(record.name);
          }}
        >
          {record.relateCaseNum}
        </a>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      ellipsis: true,
      width: 60,
      search: false,
    },
    {
      title: '负责人',
      dataIndex: 'ownerId',
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
      disable: true,
      title: '状态',
      dataIndex: 'status',
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      width: 80,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        1: {
          text: '已下架',
          status: 'Error',
        },
      },
    },
    {
      disable: true,
      title: '执行结果',
      tip: '最近一次的执行结果',
      dataIndex: 'recentExecResult',
      ellipsis: true,
      valueType: 'select',
      width: 90,
      valueEnum: {
        SUCCESS: {
          text: '成功',
          status: 'Success',
        },
        FAILE: {
          text: '失败',
          status: 'Error',
        },
        TIMEOUT: {
          text: '超时',
          status: 'Error',
        },
        NO_EXEC: {
          text: '未执行',
          status: 'Error',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },
    {
      disable: true,
      title: '子流程',
      dataIndex: 'isSubProcess',
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      width: 60,
      valueEnum: {
        1: {
          text: '是',
        },
        0: {
          text: '否',
        },
      },
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      ellipsis: true,
      width: 60,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      width: 160,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      ellipsis: true,
      width: 60,
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 160,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      fixed: 'right',
      render: (text, record, _, action) => [
        <div key="detail">
          <Tooltip title="详情">
            <Button
              icon={<FileSearchOutlined />}
              type="primary"
              size={'small'}
              onClick={() => {
                history.push('/case/proces/detail?id=' + record.id);
              }}
            />
          </Tooltip>
        </div>,
        <div key="execLog">
          <Tooltip title="执行记录">
            <Button
              icon={<ClockCircleTwoTone />}
              size={'small'}
              onClick={() => {
                setCurCaseId(record.id);
                setCurCaseName(record.name);
                setIsExecLogModalOpen(true);
              }}
            />
          </Tooltip>
        </div>,
        <div key="copy">
          <Tooltip title="复制">
            <Button
              icon={<CopyTwoTone />}
              onClick={() => {
                copy({ id: record.id }).then((res) => {
                  if (res.code === 200) {
                    props.actionRef.current.reload();
                    message.success('复制成功');
                  }
                });
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="delete">
          <Tooltip title="删除">
            <Button
              icon={<DeleteTwoTone />}
              onClick={() => {
                setDeleteCaseOpen(true);
                setCurCaseId(record.id);
                setCurCaseName(record.name);
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
      ],
    },
  ];
  // const actionRef = useRef();

  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={props.actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          if (props.selectedKeys === null || props.selectedKeys === undefined) {
            messageApi.info('请先选择左侧的树节点');
          } else {
            return list({ ...params, treeKey: props.selectedKeys, current: props.currentPage });
          }
        }}
        scroll={{ x: 1000 }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
          onChange: (e) => {
            props.setCurrentPage(e);
          },
          current: props.currentPage,
        }}
        dateFormatter="string"
        headerTitle="用例列表"
        toolBarRender={() => [
          <Button
            onClick={() => {
              if (props.selectedKeys !== null && props.selectedKeys !== undefined) {
                setIsAddModalOpen(true);
              } else {
                message.warning('请先选择左侧的树节点');
              }
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建用例
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setModOwnerOpen(true);
              } else {
                message.warning('请选择用例');
              }
            }}
            key="button"
          >
            修改负责人
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setIsMoevModalOpen(true);
              } else {
                message.warning('请选择用例');
              }
            }}
            key="button"
          >
            移动到
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setEnableCaseOpen(true);
              } else {
                message.warning('请选择用例');
              }
            }}
            key="button"
          >
            上架用例
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setDisableCaseOpen(true);
              } else {
                message.warning('请选择用例');
              }
            }}
            key="button"
          >
            下架用例
          </Button>,
        ]}
        rowSelection={{
          selectedRowKeys: selectedCaseIds,
          onSelect: onSelect, //用户手动选择/取消选择某行的回调
          onSelectMultiple: onMulSelect, //用户使用键盘 shift 选择多行的回调
          onSelectAll: onMulSelect, //用户手动选择/取消选择所有行的回调
          onChange: onChange, //选中项发生变化时的回调
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={() => setSelectedCaseIds([])}>取消选择</a>
            </Space>
          );
        }}
      />
      <AddProcessCase
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={props.actionRef}
        selectedKeys={props.selectedKeys}
        selectedNodeName={props.selectedNodeName}
      />
      <DownCase
        open={disableCaseOpen}
        setOpen={setDisableCaseOpen}
        ids={selectedCaseIds}
        actionRef={props.actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />
      <UpCase
        open={enableCaseOpen}
        setOpen={setEnableCaseOpen}
        ids={selectedCaseIds}
        actionRef={props.actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />
      <ModOwner
        open={modOwnerOpen}
        setOpen={setModOwnerOpen}
        ids={selectedCaseIds}
        actionRef={props.actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />
      <DeleteCase
        open={deleteCaseOpen}
        setOpen={setDeleteCaseOpen}
        curCaseId={curCaseId}
        actionRef={props.actionRef}
      />
      <ExecLog
        open={isExecLogModalOpen}
        setOpen={setIsExecLogModalOpen}
        caseId={curCaseId}
        caseName={curCaseName}
        caseType="mulCase"
      />
      <MoveMulTestCase
        isModalOpen={isMoveModalOpen}
        setIsModalOpen={setIsMoevModalOpen}
        selectedCaseIds={selectedCaseIds}
        setSelectedCaseIds={setSelectedCaseIds}
        actionRef={props.actionRef}
      />
      <RelateCase
        isModalOpen={isRelateCaseModalOpen}
        setIsModalOpen={setIsRelateCaseModalOpen}
        caseId={curCaseId}
        caseName={curCaseName}
      />
      {contextHolder}
    </div>
  );
};

export default ProcessCaseList;
