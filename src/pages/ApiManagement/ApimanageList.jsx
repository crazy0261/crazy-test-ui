import { priorityEnum } from '@/common';
import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { cancelClaim, claim, list, setPriority, setProdExec } from '@/services/apiManagement';
// import { listAll as listAllApp } from '@/services/application';
import {
  CopyTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
  SendOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Select, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EditApi from './EditApi';

/**
 * 接口列表页
 */
const ApimanageList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRelateCaseModalOpen, setIsRelateCaseModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const location = useLocation();
  const applicationId = location.state?.applicationId;
  const urlParams = new URL(window.location.href).searchParams;
  const apiId = urlParams.get('id');
  const [appEnum, setAppEnum] = useState([]);
  const [ownerEnum, setOwnerEnum] = useState([]);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [disableApiOpen, setDisableApiOpen] = useState(false);
  const [enableApiOpen, setEnableApiOpen] = useState(false);
  const [deleteApiOpen, setDeleteApiOpen] = useState(false);
  const [batchDelApiOpen, setBatchDelApiOpen] = useState(false);
  const [modApiTypeOpen, setModApiTypeOpen] = useState(false);
  const [curApiId, setCurApiId] = useState();
  const [moveOrCopy, setMoveOrCopy] = useState(); // 用于标记是移动，还是复制
  const [addApiOperType, setAddApiOperType] = useState(''); // 新增接口操作类型：add、edit
  let cancleRowKeys = []; // 取消选择的项目

  const operList = [
    {
      value: 'claim',
      label: '认领接口',
    },
    {
      value: 'cancelClaim',
      label: '取消认领',
    },
    {
      value: 'disableApi',
      label: '下架接口',
    },
    {
      value: 'enableApi',
      label: '上架接口',
    },
    {
      value: 'setProdExec',
      label: '设置生产执行',
    },
    {
      value: 'cancelProdExec',
      label: '取消生产执行',
    },
  ];

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

  const handleApiSet = (e) => {
    if (selectedCaseIds.length > 0) {
      if (e === 'claim') {
        claim({ apiIds: selectedCaseIds.join() }).then((res) => {
          if (res.code === 200) {
            message.success('认领成功');
            setSelectedCaseIds([]);
            actionRef.current.reload();
          }
        });
      } else if (e === 'cancelClaim') {
        cancelClaim({ apiIds: selectedCaseIds.join() }).then((res) => {
          if (res.code === 200) {
            message.success('已取消认领');
            setSelectedCaseIds([]);
            actionRef.current.reload();
          }
        });
      } else if (e === 'setProdExec') {
        setProdExec({ apiIds: selectedCaseIds.join(), canProdExec: 1 }).then((res) => {
          if (res.code === 200) {
            message.success('设置成功');
            setSelectedCaseIds([]);
            actionRef.current.reload();
          }
        });
      } else if (e === 'cancelProdExec') {
        setProdExec({ apiIds: selectedCaseIds.join(), canProdExec: 0 }).then((res) => {
          if (res.code === 200) {
            message.success('设置成功');
            setSelectedCaseIds([]);
            actionRef.current.reload();
          }
        });
      } else if (e === 'disableApi') {
        setDisableApiOpen(true);
      } else if (e === 'enableApi') {
        setEnableApiOpen(true);
      } else {
        message.error('接口操作类型错误：' + e);
      }
    } else {
      message.error('请选择接口');
    }
  };

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '应用',
      dataIndex: 'applicationId',
      ellipsis: true, // 文字超长时，是否自动缩略
      hideInTable: true,
      initialValue: applicationId,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            key="searchSelcet"
            defaultValue={applicationId}
            showSearch
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
      title: '应用',
      dataIndex: 'applicationName',
      ellipsis: true,
      width: 150,
      search: false,
    },
    {
      title: '接口名',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
      width: 200,
    },
    {
      title: '方法',
      dataIndex: 'method',
      search: false, // 是否作为查询条件
      copyable: false,
      ellipsis: true,
      width: 60,
    },
    {
      title: '接口路径',
      dataIndex: 'path',
      search: true,
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'isDelete',
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      width: 75,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        2: {
          text: '已下架',
          status: 'Error',
        },
      },
    },
    {
      disable: true,
      title: '接口类型',
      dataIndex: 'apiType',
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      width: 75,
      valueEnum: {
        OUTER: {
          text: '外部接口',
        },
        INNER: {
          text: '内部接口',
        },
        NULL: {
          text: '空',
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
      title: '负责人',
      dataIndex: 'ownerName',
      ellipsis: true,
      width: 80,
      search: false,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
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
      title: '用例数',
      dataIndex: 'caseCount',
      ellipsis: true,
      width: 60,
      search: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '等于0' },
        1: { text: '大于0' },
      },
      render: (text, record) => (
        <a
          onClick={() => {
            setIsRelateCaseModalOpen(true);
            setCurApiId(record.id);
          }}
        >
          {record.caseCount}
        </a>
      ),
    },
    {
      title: '调用次数',
      dataIndex: 'invokeTimes',
      ellipsis: true,
      width: 90,
      search: true,
      valueType: 'select',
      tip: '该接口近30天在生产环境调用次数（超过100则按100统计）',
      valueEnum: {
        0: { text: '等于0' },
        1: { text: '大于0' },
      },
      render: (text, record) => <div>{record.invokeTimes}</div>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      ellipsis: true,
      width: 60,
      search: true,
      valueType: 'select',
      valueEnum: priorityEnum,
    },
    {
      title: '生产执行',
      dataIndex: 'canProdExec',
      ellipsis: true,
      valueType: 'select',
      width: 90,
      tip: '是否可在生产环境执行，如有需要请联系管理员',
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' },
      },
    },
    {
      title: '接口id',
      dataIndex: 'apiId',
      ellipsis: true,
      width: 60,
      hideInTable: true,
      initialValue: apiId,
    },
    {
      title: '创建者',
      dataIndex: 'createByName',
      ellipsis: true,
      width: 60,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      width: 170,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '更新者',
      dataIndex: 'updateByName',
      ellipsis: true,
      width: 60,
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 170,
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
          <Tooltip title="生成用例">
            <Button
              icon={<SendOutlined />}
              type="primary"
              size={'small'}
              onClick={() => {
                window.open(
                  '/apiTestCase/detail?appId=' +
                    record.applicationId +
                    '&apiId=' +
                    record.id +
                    '&method=' +
                    record.method +
                    '&path=' +
                    record.path +
                    '&apiName=' +
                    record.name,
                );
              }}
            />
          </Tooltip>
        </div>,
        <div key="edit">
          <Tooltip title="编辑">
            <Button
              icon={<EditTwoTone />}
              onClick={() => {
                setAddApiOperType('edit');
                setRecord(record);
                setIsAddModalOpen(true);
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="copy">
          <Tooltip title="复制">
            <Button
              icon={<CopyTwoTone />}
              onClick={() => {
                setAddApiOperType('add');
                setRecord(record);
                setIsAddModalOpen(true);
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
                setDeleteApiOpen(true);
                setCurApiId(record.id);
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
        let owners = [];
        owners.push({ value: 0, label: '-空-' });
        result.data.map((item) => owners.push({ value: item.id, label: item.name }));
        setOwnerEnum(owners);
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
        request={async (params = {}, sort, filter) => {
          return list(params);
        }}
        scroll={{ x: 1300 }}
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
        headerTitle="接口列表"
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
            onClick={() => {
              setAddApiOperType('add');
              setRecord(null);
              setIsAddModalOpen(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setModApiTypeOpen(true);
              } else {
                message.warning('请选择接口');
              }
            }}
            key="button"
          >
            修改接口类型
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setBatchDelApiOpen(true);
              } else {
                message.warning('请选择接口');
              }
            }}
            key="button"
          >
            批量删除
          </Button>,
          <Button
            onClick={() => {
              if (selectedCaseIds.length > 0) {
                setMoveOrCopy('move');
                setIsMoveModalOpen(true);
              } else {
                message.warning('请选择接口');
              }
            }}
            key="button"
          >
            移动到
          </Button>,
          <Button
            onClick={() => {
              setIsImportModalOpen(true);
            }}
            key="import"
            icon={<VerticalAlignBottomOutlined />}
          >
            导入
          </Button>,
          <Select
            allowClear
            key="priority"
            style={{ width: 120 }}
            value={null}
            // options={priorityList}
            placeholder="设置优先级"
            onChange={(e) => {
              if (selectedCaseIds.length > 0) {
                setPriority({ apiIds: selectedCaseIds.join(), priority: e }).then((res) => {
                  if (res.code === 200) {
                    message.success('优先级设置成功');
                    setSelectedCaseIds([]);
                    actionRef.current.reload();
                  }
                });
              } else {
                message.error('请选择接口');
              }
            }}
          />,
          <Select
            key="option"
            allowClear
            style={{ width: 120 }}
            value={null}
            options={operList}
            placeholder="其他操作"
            onChange={(e) => handleApiSet(e)}
          />,
        ]}
      />
      <EditApi
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
        setRecord={setRecord}
        appEnum={appEnum}
        ownerEnum={ownerEnum}
        addApiOperType={addApiOperType}
      />
      {/* <ImportApi
        isModalOpen={isImportModalOpen}
        setIsModalOpen={setIsImportModalOpen}
        appEnum={appEnum}
        actionRef={actionRef}
      /> */}
      {/* <DisableApi
        open={disableApiOpen}
        setOpen={setDisableApiOpen}
        apiIds={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      /> */}
      {/* <EnableApi
        open={enableApiOpen}
        setOpen={setEnableApiOpen}
        apiIds={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      /> */}
      {/* <DeleteApi
        open={deleteApiOpen}
        setOpen={setDeleteApiOpen}
        curApiId={curApiId}
        actionRef={actionRef}
      /> */}
      {/* <RelateCaseList
        open={isRelateCaseModalOpen}
        setOpen={setIsRelateCaseModalOpen}
        apiId={curApiId}
      /> */}
      {/* <MoveApi
        isModalOpen={isMoveModalOpen}
        setIsModalOpen={setIsMoveModalOpen}
        actionRef={actionRef}
        appEnum={appEnum}
        moveOrCopy={moveOrCopy}
        selectedCaseIds={selectedCaseIds}
        clearSelectedCaseIds={clearSelectedCaseIds}
      /> */}
      {/* <BatchDeleteApi
        isModalOpen={batchDelApiOpen}
        setIsModalOpen={setBatchDelApiOpen}
        apiIds={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      /> */}
      {/* <ModApiType
        isModalOpen={modApiTypeOpen}
        setIsModalOpen={setModApiTypeOpen}
        apiIds={selectedCaseIds.join()}
        actionRef={actionRef}
        clearSelectedCaseIds={clearSelectedCaseIds}
      />  */}
    </div>
  );
};

export default ApimanageList;
