import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { deleteApplication, list } from '@/services/applicationManagement';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  FileSearchOutlined,
  PlayCircleTwoTone,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Modal as model, Select, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddApplication from './AddApplication';
import DebugByApp from './DebugByApp';

/**
 * 应用列表页
 */
const ApplicationList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [ownerEnum, setOwnerEnum] = useState([]);

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
    requestOwnerEnum();
  }, []);

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    // {
    //   title: '应用ID',
    //   dataIndex: 'id',
    //   search: false,
    //   copyable: false,
    //   ellipsis: true,
    //   width: 80,
    // },
    {
      title: '应用名',
      dataIndex: 'name',
      ellipsis: true,
      search: true,
      width: 200,
    },
    {
      title: '应用描述',
      dataIndex: 'remark',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 150,
    },
    {
      title: '接口数',
      dataIndex: 'apiCount',
      search: false,
      copyable: false,
      ellipsis: true,
      sorter: (a, b) => a.apiCount - b.apiCount,
      width: 80,
    },
    {
      title: '已覆盖接口数',
      dataIndex: 'coverApiCount',
      search: false,
      copyable: false,
      ellipsis: true,
      sorter: (a, b) => a.coverApiNum - b.coverApiNum,
      width: 120,
    },
    {
      title: '接口覆盖率',
      dataIndex: 'apiCoverRate',
      search: false,
      copyable: false,
      ellipsis: true,
      sorter: (a, b) => a.apiCoverRate - b.apiCoverRate,
      width: 110,
      valueType: {
        type: 'percent',
        precision: 0,
      },
    },
    {
      title: '外部接口覆盖率',
      dataIndex: 'outerApiCoverRate',
      search: false,
      copyable: false,
      ellipsis: true,
      sorter: (a, b) => a.outerApiCoverRate - b.outerApiCoverRate,
      width: 130,
      valueType: {
        type: 'percent',
        precision: 0,
      },
    },
    {
      title: '内部接口覆盖率',
      dataIndex: 'innerApiCoverRate',
      search: false,
      copyable: false,
      ellipsis: true,
      sorter: (a, b) => a.innerApiCoverRate - b.innerApiCoverRate,
      width: 130,
      valueType: {
        type: 'percent',
        precision: 0,
      },
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '创建者',
      dataIndex: 'createByName',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false, // 是否作为查询条件
      copyable: false,
      ellipsis: true,
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: '更新者',
      dataIndex: 'updateByName',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false, // 是否作为查询条件
      copyable: false,
      ellipsis: true,
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: '负责人',
      dataIndex: 'ownerId',
      ellipsis: true,
      width: 60,
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
      title: '创建者',
      dataIndex: 'creator',
      ellipsis: true,
      width: 60,
      search: false,
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
      title: '操作',
      valueType: 'option',
      width: 130,
      fixed: 'right',
      render: (text, record, _, action) => [
        <div key="detail">
          <Tooltip title="查询接口">
            <Button
              icon={<FileSearchOutlined />}
              type="primary"
              onClick={() => handleClickDetail(record)}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="edit">
          <Tooltip title="编辑">
            <Button
              icon={<EditTwoTone />}
              onClick={() => {
                setRecord(record);
                setIsAddModalOpen(true);
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="exec">
          <Tooltip title="执行应用下全部接口用例">
            <Button
              icon={<PlayCircleTwoTone />}
              onClick={() => {
                setRecord(record);
                setIsDebugModalOpen(true);
              }}
              size={'small'}
            />
          </Tooltip>
        </div>,
        <div key="delete">
          <Tooltip title="删除">
            <Button
              icon={<DeleteTwoTone />}
              onClick={() => showDeleteConfirm(record.id)}
              size={'small'}
            />
          </Tooltip>
        </div>,
      ],
    },
  ];
  const actionRef = useRef();
  const handleClickDetail = (record) => {
    history.push('/application/apimanage', { applicationId: record.id });
  };
  const showDeleteConfirm = (id) => {
    model.confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleFilled />,
      content: '一旦删除将无法恢复',
      okType: 'danger',
      okButtonProps: { loading: isLoading },
      onOk() {
        setIsLoading(true);
        deleteApplication({ id: id }).then((res) => {
          setIsLoading(false);
          if (res.code === 200) {
            actionRef.current.reload();
            message.success('删除成功');
          }
        });
      },
      onCancel() {},
    });
  };

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
        headerTitle="应用列表"
        toolBarRender={() => [
          <Button
            onClick={() => setIsAddModalOpen(true)}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <AddApplication
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
        setRecord={setRecord}
      />
      <DebugByApp
        isModalOpen={isDebugModalOpen}
        setIsModalOpen={setIsDebugModalOpen}
        record={record}
        setRecord={setRecord}
      />
    </div>
  );
};

export default ApplicationList;
