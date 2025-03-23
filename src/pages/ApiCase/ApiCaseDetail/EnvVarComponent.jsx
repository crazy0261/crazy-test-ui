import { listPage } from '@/services/testAccountManagement';
import { EditableProTable, ProFormSelect } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { useEffect, useState } from 'react';

// 设置环境变量的公共组件
const EnvVarComponent = (props) => {
  const [editForm] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState(() =>
    props.dataSource.map((item) => item.id),
  );
  const [testAccountList, setTestAccountList] = useState([]);
  useEffect(() => {
    setEditableRowKeys(props.dataSource.map((item) => item.id));
  }, [props.dataSource]);

  // 查询测试账号列表
  const queryTestAccountList = () => {
    listPage({ current: 1, pageSize: 1000 }).then((result) => {
      if (result.code === 200) {
        setTestAccountList(result.data.map((item) => ({ value: item.id, label: item.name })));
      } else {
        message.error('查询测试账号列表失败');
      }
    });
  };

  // 首次进入页面
  useEffect(() => {
    if (props.needTestAccount === true) {
      queryTestAccountList();
    }
  }, []);
  const columns = [
    {
      title: props.keyName === undefined ? 'key' : props.keyName,
      dataIndex: 'key',
    },
    {
      title: props.valueName === undefined ? 'value' : props.valueName,
      dataIndex: 'value',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      render: () => {
        return null;
      },
    },
  ];

  return (
    <div>
      {props.needTestAccount === true && (
        <div style={{ display: 'flex' }}>
          <ProFormSelect
            showSearch
            options={testAccountList}
            width={250}
            label="测试账号"
            onChange={(e) => props.setTestAccount(e)}
            disabled={!props.isEdit}
            value={props.testAccount}
            placeholder={'无'}
          />
          {props.syncEnvVar !== null && props.syncEnvVar !== undefined && (
            <Button type="primary" style={{ marginLeft: 10 }} onClick={props.syncEnvVar}>
              同步到其他环境
            </Button>
          )}
        </div>
      )}
      {props.isEdit && (
        <EditableProTable
          columns={columns}
          rowKey="id"
          value={props.dataSource}
          onChange={props.setDataSource}
          recordCreatorProps={
            props.isEdit
              ? {
                  newRecordType: 'dataSource',
                  record: () => ({
                    id: Date.now().toString(),
                  }),
                }
              : false
          }
          toolBarRender={() => {
            return [];
          }}
          editable={{
            type: 'multiple',
            form: editForm,
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              // return [defaultDoms.delete]; // 需要二次确认
              return [
                <Button
                  type="link"
                  key="delete"
                  onClick={() => {
                    props.setDataSource(props.dataSource.filter((item) => item.id !== row.id));
                  }}
                >
                  删除
                </Button>,
              ];
            },
            onValuesChange: (record, recordList) => {
              props.setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />
      )}

      {!props.isEdit && (
        <EditableProTable
          columns={columns}
          rowKey="id"
          value={props.dataSource}
          onChange={props.setDataSource}
          recordCreatorProps={
            props.isEdit
              ? {
                  newRecordType: 'dataSource',
                  record: () => ({
                    id: Date.now().toString(),
                  }),
                }
              : false
          }
          toolBarRender={() => {
            return [];
          }}
        />
      )}
    </div>
  );
};

export default EnvVarComponent;
