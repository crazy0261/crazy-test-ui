// import { priorityEnum } from '@/pages/Common/utils';
import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { copy, list } from '@/services/apiCase';
// import { listAll as listAllApp } from '@/services/application';
import {
  ClockCircleTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
  FileSearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Select, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
// import ExecLog from '../MulTestCase/ExecLog';
// import DeleteCase from './DeleteCase';
// import DisableCase from './DisableCase';
// import EnableCase from './EnableCase';
// import ModOwner from './ModOwner';

/**
 * 用例列表页
 */
const ApiCaseList = () => {
  const [appEnum, setAppEnum] = useState([]);
  const [ownerEnum, setOwnerEnum] = useState([]);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [disableCaseOpen, setDisableCaseOpen] = useState(false);
  const [enableCaseOpen, setEnableCaseOpen] = useState(false);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState(false);
  const [modOwnerOpen, setModOwnerOpen] = useState(false);
  const [curApiId, setCurApiId] = useState();
  const [isExecLogModalOpen, setIsExecLogModalOpen] = useState(false);
  const [curCaseId, setCurCaseId] = useState();
  const [curCaseName, setCurCaseName] = useState();
  let cancleRowKeys = []; // 取消选择的项目

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
      fixed: 'left',
    },
    {
      title: '用例名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      copyable: true,
      width: 200,
      render: (text, record) => (
        <a href={'/apiTestCase/detail?id=' + record.id} target={'_blank'} rel={'noreferrer'}>
          {record.name}
        </a>
      ),
    },
    {
      title: '应用名',
      dataIndex: 'appName',
      ellipsis: true,
      width: 150,
      search: false,
      // fixed: 'left',
    },
    {
      title: '应用名',
      dataIndex: 'appId',
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
            options={appEnum}
          ></Select>
        );
      },
    },
    {
      title: '接口路径',
      dataIndex: 'path',
      ellipsis: true,
      copyable: true,
      width: 200,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      ellipsis: true,
      width: 60,
      search: false,
      valueType: 'select',
      //   valueEnum: priorityEnum,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'isDelete',
      ellipsis: true,
      valueType: 'select',
      width: 80,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        2: {
          text: '已下架',
          status: 'Default',
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
          status: 'Default',
        },
      },
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      ellipsis: true,
      width: 70,
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
            options={ownerEnum}
          ></Select>
        );
      },
    },
    {
      title: '作者',
      dataIndex: 'creatorName',
      ellipsis: true,
      width: 70,
      search: false,
    },
    {
      title: '作者',
      dataIndex: 'creator',
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
            options={ownerEnum}
          ></Select>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 100,
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
      title: '操作',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (text, record, _, action) => [
        <div key="detail">
          <Tooltip title="详情">
            <Button
              icon={<FileSearchOutlined />}
              type="primary"
              size={'small'}
              onClick={() => {
                window.open('/apiTestCase/detail?id=' + record.id);
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
                    actionRef.current.reload();
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
                setCurApiId(record.id);
                // showDeleteConfirm(record.id)
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
      ],
    },
  ];
  const actionRef = useRef();

  const requestAppEnum = () => {
    // listAllApp().then((result) => {
    //   if (result.code === 200) {
    //     setAppEnum(result.data.map((item) => ({ value: item.id, label: item.name })));
    //   }
    // });
  };

  const requestOwnerEnum = () => {
    listAllUser().then((result) => {
      if (result.code === 200) {
        setOwnerEnum(result.data.map((item) => ({ value: item.id, label: item.name })));
      }
    });
  };

  useEffect(() => {
    requestAppEnum();
    requestOwnerEnum();
  }, []);

  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: 1300 }}
        request={async (params = {}, sort, filter) => {
          return list(params);
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
            listsHeight: 800,
          },
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: pageSize,
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
        dateFormatter="string"
        headerTitle="用例列表"
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
        toolBarRender={() => [
          <Button
            onClick={() => window.open('/apiTestCase/detail')}
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
                window.open('/apiTestCase/batchExec?CaseIds=' + selectedCaseIds);
              } else {
                message.warning('请选择用例');
              }
            }}
            key="button"
          >
            批量执行
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
      />
      {/* <DisableCase
        open={disableCaseOpen}
        setOpen={setDisableCaseOpen}
        ids={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      /> */}
      {/* <EnableCase
        open={enableCaseOpen}
        setOpen={setEnableCaseOpen}
        ids={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />
      <ModOwner
        open={modOwnerOpen}
        setOpen={setModOwnerOpen}
        ids={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />
      <DeleteCase
        open={deleteCaseOpen}
        setOpen={setDeleteCaseOpen}
        curApiId={curApiId}
        actionRef={actionRef}
      />
      <ExecLog
        open={isExecLogModalOpen}
        setOpen={setIsExecLogModalOpen}
        caseId={curCaseId}
        caseName={curCaseName}
        caseType="apiCase"
      /> */}
    </div>
  );
};

export default ApiCaseList;
