import EditTask from '@/pages/TaskManagement/EditTask';
import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { deleteSchedule, execOnce, listAll } from '@/services/taskManagement';
import {
  DeleteTwoTone,
  ExclamationCircleFilled,
  FileSearchOutlined,
  PlayCircleTwoTone,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Breadcrumb, Button, message, Modal as model, Select, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

const TaskManagementList = () => {
  const [ownerEnum, setOwnerEnum] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef();
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      ellipsis: true,
      search: true,
      render: (text, record) => (
        <a href={'/schedule/detail/' + record.id} target={'_blank'} rel={'noreferrer'}>
          {record.name}
        </a>
      ),
    },
    {
      title: '用例类型',
      dataIndex: 'testcaseType',
      ellipsis: true,
      width: 100,
      valueEnum: {
        API_CASE: { text: '接口用例' },
        MUL_CASE: { text: '场景用例' },
      },
    },
    {
      title: 'cron',
      dataIndex: 'cron',
      ellipsis: true,
      width: 150,
      search: false,
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'enable',
      ellipsis: true,
      width: 100,
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '负责人',
      dataIndex: 'creatorName',
      ellipsis: true,
      width: 100,
      search: false,
    },
    // {
    //   title: '执行结果',
    //   tip: '最近一次执行结果',
    //   dataIndex: 'status',
    //   ellipsis: true,
    //   width: 100,
    //   search: false,
    //   valueEnum: {
    //     INIT: { text: '初始化', status: 'Default' },
    //     RUNNING: { text: '执行中', status: 'Processing' },
    //     SUCCESS: { text: '执行完成', status: 'Success' },
    //     FAILE: { text: '执行失败', status: 'Error' },
    //   },
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 150,
      search: false,
    },
    {
      title: '作者',
      dataIndex: 'creatorId',
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
      key: 'option',
      width: 110,
      render: (text, record, _, action) => [
        <div key="detail">
          <Tooltip title="详情">
            <Button
              icon={<FileSearchOutlined />}
              type="primary"
              size={'small'}
              onClick={() => history.push('/schedule/detail/' + record.id)}
            />
          </Tooltip>
        </div>,
        <div key="retry">
          <Tooltip title="手工触发">
            <Button
              icon={<PlayCircleTwoTone />}
              size={'small'}
              onClick={() => {
                execOnce({ id: record.id, once: true }).then((res) => {
                  if (res.code === 200) {
                    message.success('触发成功');
                  }
                });
              }}
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

  const showDeleteConfirm = (id) => {
    model.confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleFilled />,
      content: '一旦删除将无法恢复',
      okType: 'danger',
      okButtonProps: { loading: isLoading },
      onOk() {
        setIsLoading(true);
        deleteSchedule({ id: id }).then((res) => {
          setIsLoading(false);
          if (res.code === 200) {
            message.success('删除成功');
            ref.current.reload();
          }
        });
      },
      onCancel() {},
    });
  };

  const requestOwnerEnum = () => {
    listAllUser().then((result) => {
      if (result.code === 200) {
        setOwnerEnum(result.data.map((item) => ({ value: item.id, label: item.name })));
      }
    });
  };

  const onEditTask = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    requestOwnerEnum();
  }, []);

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 10 }}
        items={[
          {
            title: '任务列表',
          },
        ]}
      />
      <ProTable
        columns={columns}
        actionRef={ref}
        cardBordered
        request={async (params = {}, sort, filter) => {
          return listAll(params);
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
        headerTitle="任务列表"
        toolBarRender={() => [
          <Button
            // onClick={() => history.push('/task/detail')}
            onClick={onEditTask}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <EditTask isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default TaskManagementList;
