import { listAll as listAllUser } from '@/services/ant-design-pro/api';
import { list } from '@/services/apiTestcase';
import { listAll as listAllApp } from '@/services/applicationManagement';
import { ProTable } from '@ant-design/pro-components';
import { Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

/**
 * 定时任务-选择接口用例
 */
const SelectApiTestCase = (props) => {
  const [appEnum, setAppEnum] = useState([]);
  const [ownerEnum, setOwnerEnum] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  let cancleRowKeys = []; // 取消选择的项目

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
      const keys = props.selectedCaseIds.filter((item) => !cancleRowKeys.includes(item));
      props.setSelectedCaseIds(keys);
      cancleRowKeys = [];
    } else {
      props.setSelectedCaseIds([...new Set(props.selectedCaseIds.concat(selectedRowKeys))]);
    }
  };

  useEffect(() => {
    console.log('props.selectedCaseIds=', props.selectedCaseIds);
  }, [props.selectedCaseIds]);

  const columns = [
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
      title: '应用名',
      dataIndex: 'appName',
      ellipsis: true,
      width: 120,
      search: false,
    },
    {
      title: '用例名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '接口路径',
      dataIndex: 'path',
      ellipsis: true,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'isDelete',
      // filters: true,
      // onFilter: true,
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
      title: '作者',
      dataIndex: 'creatorName',
      ellipsis: true,
      width: 60,
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
  ];
  const actionRef = useRef();

  const requestAppEnum = () => {
    listAllApp().then((result) => {
      if (result.code === 200) {
        setAppEnum(result.data.map((item) => ({ value: item.id, label: item.name })));
      }
    });
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
          // layout: 'vertical',
          // defaultCollapsed: false,
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
        headerTitle="用例列表"
        rowSelection={{
          selectedRowKeys: props.selectedCaseIds,
          onSelect: onSelect, //用户手动选择/取消选择某行的回调
          onSelectMultiple: onMulSelect, //用户使用键盘 shift 选择多行的回调
          onSelectAll: onMulSelect, //用户手动选择/取消选择所有行的回调
          onChange: onChange, //选中项发生变化时的回调
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              {/* <a onClick={() => props.setSelectedCaseIds([])}>取消选择</a> */}
              <a onClick={() => props.setSelectedCaseIds([])}></a>
            </Space>
          );
        }}
      />
      {/* <Button
        type="primary"
        style={{ margin: 10, float: 'left', left: '50%' }}
        onClick={() => {
          message.success('已选择' + props.selectedCaseIds.length + '个用例');
          props.setOpen(false);
        }}
      >
        确定
      </Button> */}
    </div>
  );
};

export default SelectApiTestCase;
