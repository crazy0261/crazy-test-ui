import { EditableProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
// import CaseVar from './CaseVar';
// import CommonVar from './CommonVar';

// 设置请求头
const SetReqHeader = (props) => {
  const [editableKeys, setEditableRowKeys] = useState(() =>
    props.dataSource.map((item) => item.id),
  );
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);
  const isMulCase = window.location.href.indexOf('mulTestCase') !== -1;

  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      width: '30%',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'value',
      dataIndex: 'value',
      width: '55%',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
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
      {isMulCase && (
        <Button
          size="small"
          type="primary"
          style={{ marginRight: 10, marginBottom: 5 }}
          onClick={() => setCaseVarModalOpen(true)}
        >
          用例变量
        </Button>
      )}
      <Button
        size="small"
        type="primary"
        style={{ marginRight: 10, marginBottom: 5 }}
        onClick={() => setCommonVarModalOpen(true)}
      >
        公共变量
      </Button>
      {props.isEdit && (
        <EditableProTable
          style={{ width: '100%' }}
          columns={columns}
          rowKey="id"
          value={props.dataSource}
          onChange={props.setDataSource}
          recordCreatorProps={
            props.isEdit === true
              ? {
                  newRecordType: 'dataSource',
                  record: () => ({
                    id: Date.now(),
                  }),
                }
              : false
          }
          toolBarRender={() => {
            return [];
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              // return [defaultDoms.delete];
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
          style={{ width: '100%' }}
          columns={columns}
          rowKey="id"
          value={props.dataSource}
          onChange={props.setDataSource}
          recordCreatorProps={
            props.isEdit === true
              ? {
                  newRecordType: 'dataSource',
                  record: () => ({
                    id: Date.now(),
                  }),
                }
              : false
          }
          toolBarRender={() => {
            return [];
          }}
        />
      )}

      {/* <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} /> */}
    </div>
  );
};

export default SetReqHeader;
