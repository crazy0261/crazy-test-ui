import { genAsserts as genApiCaseAsserts } from '@/services/apiCase';
// import { genAsserts as genMulcaseAsserts } from '@/services/mulTestcaseResultNode';
import { EditableProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
// import CaseVar from './CaseVar';
// import CommonVar from './CommonVar';

// 设置断言
const SetAssert = (props) => {
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState(() =>
    props.dataSource.map((item) => item.id),
  );
  const urlParams = new URL(window.location.href).searchParams;
  const [testcaseId, setTestcaseId] = useState(urlParams.get('id'));
  const isMulCase = window.location.href.indexOf('mulTestCase') !== -1;
  const [isGenAssetsLoading, setIsGenAssetsLoading] = useState(false);

  const genAssertsByCaseId = () => {
    setIsGenAssetsLoading(true);
    if (isMulCase) {
      //   genMulcaseAsserts({ testcaseId: testcaseId, nodeId: props.nodeId }).then((result) => {
      //     if (result.code === 200) {
      //       props.enableEdit();
      //       props.setDataSource(result.data);
      //     }
      //     setIsGenAssetsLoading(false);
      //   }
      // );
    } else {
      genApiCaseAsserts({ testcaseId: testcaseId }).then((result) => {
        if (result.code === 200) {
          props.enableEdit();
          props.setDataSource(result.data);
        }
        setIsGenAssetsLoading(false);
      });
    }
  };

  useEffect(() => {
    setEditableRowKeys(props.dataSource.map((item) => item.id));
  }, [props.dataSource]);

  const columns = [
    {
      title: 'JSONPath',
      tip: '一、从JSONObject中取值：code；二、数组大小：data.records.size()三、从JSONArray中取值：data.records[0].stationOrderNo',
      dataIndex: 'jsonpath',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: '条件',
      key: 'condition',
      dataIndex: 'condition',
      valueType: 'select',
      width: 120,
      valueEnum: {
        contains: { text: '包含' },
        not_contains: { text: '不包含' },
        IN: { text: 'IN' },
        '=': { text: '=' },
        '!=': { text: '!=' },
        '>': { text: '>' },
        '>=': { text: '≥' },
        '<': { text: '<' },
        '<=': { text: '≤' },
        IS_NULL: { text: '= null' },
        IS_NOT_NULL: { text: '!= null' },
      },
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: '期望值',
      dataIndex: 'expValue',
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
      <Button
        size="small"
        type="primary"
        loading={isGenAssetsLoading}
        style={{ marginRight: 10, marginBottom: 5 }}
        onClick={() => genAssertsByCaseId()}
      >
        生成断言
      </Button>
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
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
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
      {/* <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} /> */}
    </div>
  );
};

export default SetAssert;
