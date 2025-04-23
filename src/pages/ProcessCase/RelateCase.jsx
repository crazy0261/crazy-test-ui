// import { queryRelateCase } from '@/services/mulTestcase';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 关联用例
const RelateCase = (props) => {
  const actionRef = useRef();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (props.isModalOpen) {
      actionRef?.current?.reload();
    }
  }, [props.isModalOpen]);

  const handleOk = () => {
    setCurrentPage(1);
    actionRef.current.reload();
    props.setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCurrentPage(1);
    props.setIsModalOpen(false);
  };

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用例名',
      dataIndex: 'name',
      search: false,
      copyable: false,
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'creatorName',
      search: false,
      copyable: false,
      ellipsis: true,
      width: 80,
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 80,
      render: (text, record, _, action) => [
        <div key="detail">
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              window.open('/mulTestCase/detail?id=' + record.id);
            }}
          >
            详情
          </Button>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <Modal
        width={700}
        title={'关联用例'}
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={() => {
            // return queryRelateCase({
            //   caseId: props.caseId,
            //   current: currentPage,
            //   pageSize: pageSize,
            // });
          }}
          pagination={{
            showSizeChanger: true,
            pageSize: pageSize,
            onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
            onChange: (e) => {
              setCurrentPage(e);
            },
            current: currentPage,
          }}
          editable={{
            type: 'multiple',
          }}
          rowKey="id"
          options={false}
          search={false}
          dateFormatter="string"
        />
      </Modal>
    </div>
  );
};

export default RelateCase;
