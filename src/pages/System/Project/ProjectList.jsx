import { deleteById, listPage } from '@/services/project';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal as model } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditProject from './AddOrEditProject';

/**
 * 项目列表页
 */
const ProjectList = () => {
  const actionRef = useRef();
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
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      copyable: false,
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      copyable: false,
      ellipsis: true,
      search: false,
      width: 170,
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
        deleteById({ id: id }).then((res) => {
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
        headerTitle="项目列表"
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
      <EditProject
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
      />
    </div>
  );
};

export default ProjectList;
