import { queryEnvTestAccount } from '@/services/testAccount';
import { EditableProTable, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const DebugEnvVarComponen = (props) => {
  const {
    dataSource,
    setDataSource,
    testAccount,
    setTestAccount,
    isEdit,
    needTestAccount,
    isForminit,
  } = props;

  const [testAccountList, setTestAccountList] = useState([]);

  // 查询测试账号列表
  const queryTestAccountList = () => {
    queryEnvTestAccount().then((result) => {
      if (result.code === 200) {
        setTestAccountList(result.data.map((item) => ({ value: item.id, label: item.name })));
      } else {
        message.error('查询测试账号列表失败');
      }
    });
  };

  useEffect(() => {
    setDataSource(dataSource);
  }, [isForminit]);

  useEffect(() => {
    if (needTestAccount) {
      queryTestAccountList();
    }
  }, [needTestAccount]);

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: 200,
      editable: isEdit,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 200,
      editable: isEdit,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      editable: isEdit,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: () => {
        return null;
      },
    },
  ];

  return (
    <div>
      {needTestAccount && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <ProFormSelect
            showSearch
            options={testAccountList}
            width={250}
            label="测试账号"
            onChange={(value) => setTestAccount(value)}
            disabled={!isEdit}
            value={testAccount}
            placeholder="请选择测试账号"
          />
        </div>
      )}

      <EditableProTable
        columns={columns}
        rowKey="id"
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={
          props.hide
            ? false
            : {
                newRecordType: 'dataSource',
                record: () => ({
                  id: Date.now() + Math.floor(Math.random() * 9999) + 1000,
                }),
              }
        }
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
        }}
      />
    </div>
  );
};

export default DebugEnvVarComponen;
