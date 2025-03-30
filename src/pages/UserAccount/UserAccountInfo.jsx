import { del, userListApi } from '@/services/user/index';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal as model } from 'antd';
import { useRef, useState } from 'react';
import EditUser from './EditUser';

const UserAccountInfo = () => {
  const actionRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [record, setRecord] = useState(null);

  const onOk = () => {
    setModalOpen(true);
  };

  const showDeleteConfirm = (id) => {
    model.confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleFilled />,
      content: '一旦删除将无法恢复',
      okType: 'danger',
      onOk() {
        del({ id: id }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            actionRef.current.reload();
          }
        });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '账号',
      dataIndex: 'account',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      copyable: false,
      ellipsis: true,
      search: false,
      valueType: 'select',
      valueEnum: {
        1: {
          text: '管理员',
        },
        0: {
          text: '质量员',
        },
      },
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        true: {
          text: '停用',
          status: 'Error',
        },
        false: {
          text: '启用',
          status: 'Success',
        },
      },
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      copyable: false,
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      hideInSearch: true,
    },
    {
      title: '修改人',
      dataIndex: 'updateByName',
      copyable: false,
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '修改时间',
      key: 'showTime',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <div key="edit">
          <Button
            icon={<EditTwoTone />}
            onClick={() => {
              setRecord(record);
              onOk();
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

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          return await userListApi({
            account: params.account,
            name: params.name,
            phone: params.phone,
            status: params.status,
            current: params.current,
            pageSize: params.pageSize,
          }).then((res) => {
            return {
              data: res.data,
              success: true,
              total: res.total,
            };
          });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
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
          // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setRecord(null);
              onOk();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <EditUser
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        record={record}
        actionRef={actionRef}
      />
    </>
  );
};

export default UserAccountInfo;
