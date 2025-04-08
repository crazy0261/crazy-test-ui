import { del, list } from '@/services/dataSource';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal as model } from 'antd';
import { useRef, useState } from 'react';
import EditDataSource from './EditDataSource';

/**
 * 数据源管理
 */
const DataSourceList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true, // 是否可复制
      ellipsis: true, // 文字超长时，是否自动缩略
    },
    {
      title: '描述',
      dataIndex: 'remark',
      copyable: false, // 是否可复制
      ellipsis: true, // 文字超长时，是否自动缩略
    },
    {
      title: '创建者',
      dataIndex: 'createByName',
      copyable: false, // 是否可复制
      ellipsis: true, // 文字超长时，是否自动缩略
      search: false,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false, // 是否作为查询条件
      copyable: false,
      ellipsis: true,
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '修改者',
      dataIndex: 'updateByName',
      copyable: false, // 是否可复制
      ellipsis: true, // 文字超长时，是否自动缩略
      search: false,
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      search: false, // 是否作为查询条件
      copyable: false,
      ellipsis: true,
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 80,
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
        <div key="delete">
          <Button
            icon={<DeleteTwoTone />}
            onClick={() => showDeleteConfirm(record.id)}
            size={'small'}
          ></Button>
        </div>,
      ],
    },
  ];
  const actionRef = useRef();

  const showDeleteConfirm = (id) => {
    model.confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleFilled />,
      content: '一旦删除将无法恢复',
      okType: 'danger',
      onOk() {
        del({ id: id }).then((res) => {
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
        headerTitle="数据源列表"
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
      <EditDataSource
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
        setRecord={setRecord}
      />
    </div>
  );
};

export default DataSourceList;
