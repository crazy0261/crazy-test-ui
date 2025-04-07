import { list as appList } from '@/services/applicationManagement';
// import { listAll as listAllDomain } from '@/services/config/domainInfo';
import { del, list } from '@/services/envConfig';
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal as model, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditEnvConfig from './EditEnvConfig';

/**
 * 环境列表页
 */
const EnvConfigList = () => {
  const actionRef = useRef();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [appEnum, setAppEnum] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [envList, setEnvList] = useState([]);

  // useEffect(() => {
  //   listAllEnvName().then((result) => {
  //     if (result.code === 200) {
  //       setEnvList(result.data.map((item) => ({ value: item.id, label: item.name })));
  //     } else {
  //       message.error('查询环境名称列表失败');
  //     }
  //   });
  // }, []);

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

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '应用',
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
      title: '环境名',
      dataIndex: 'envName',
      ellipsis: true,
      search: true,
      // width: 150,
    },
    {
      title: '应用',
      dataIndex: 'appName',
      ellipsis: true,
      // width: 150,
      search: false,
    },
    {
      title: '域名',
      dataIndex: 'domainName',
      copyable: false,
      ellipsis: true,
      search: true,
    },
    {
      title: '顺序',
      dataIndex: 'envSort',
      valueType: 'digit',
      copyable: false,
      ellipsis: true,
      sorter: true,
      search: false,
    },
    {
      title: '创建者',
      dataIndex: 'createByName',
      copyable: false,
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      copyable: false,
      ellipsis: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '修改者',
      dataIndex: 'updateByName',
      copyable: false,
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      copyable: false,
      ellipsis: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 60,
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

  const requestAppEnum = () => {
    appList({ current: 1, pageSize: 1000 }).then((result) => {
      if (result.code === 200) {
        setAppEnum(result.data.map((item) => ({ value: item.id, label: item.name })));
      } else {
        message.error('查询应用列表失败');
      }
    });
  };

  const requestDomain = () => {
    // listAllDomain().then((result) => {
    //   if (result.code === 200) {
    //     setDomainList(result.data.map((item) => ({ value: item.id, label: item.name })));
    //   } else {
    //     message.error('查询域名列表失败');
    //   }
    // });
  };

  useEffect(() => {
    // 应用
    // requestDomain();
    requestAppEnum();
  }, []);

  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          return list(params, sort);
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
        headerTitle="环境列表"
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
      <EditEnvConfig
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        actionRef={actionRef}
        record={record}
        setRecord={setRecord}
        domainList={domainList}
      />
    </div>
  );
};

export default EnvConfigList;
