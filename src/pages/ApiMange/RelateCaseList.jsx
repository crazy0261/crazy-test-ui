import { queryRelateCase } from '@/services/apiManage';
import { ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useEffect, useRef } from 'react';

const RelateCaseList = (props) => {
  useEffect(() => {
    if (props.open) {
      actionRef?.current?.reload();
    }
  }, [props.open]);

  const handleOk = () => {
    actionRef.current.reload();
    props.setOpen(false);
  };
  const handleCancel = () => {
    props.setOpen(false);
  };

  const actionRef = useRef();

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用例ID',
      dataIndex: 'caseId',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 90,
    },
    {
      title: '用例类型',
      dataIndex: 'caseType',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 90,
    },
    {
      title: '用例名',
      dataIndex: 'caseName',
      search: false,
      copyable: false,
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            if (record.caseType === '接口用例') {
              window.open('/apiTestCase/detail?id=' + record.caseId);
            } else if (record.caseType === '场景用例') {
              window.open('/mulTestCase/detail?id=' + record.caseId);
            }
          }}
        >
          {record.caseName}
        </a>
      ),
    },
  ];

  return (
    <Modal
      width={700}
      title="关联用例列表"
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          return queryRelateCase({ id: props.apiId });
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        options={false}
        search={false}
        pagination={false}
        dateFormatter="string"
      />
    </Modal>
  );
};

export default RelateCaseList;
