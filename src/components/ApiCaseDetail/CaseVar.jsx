// import { queryCaseVar } from '@/services/mulTestcase';
import { Modal } from 'antd';

/* 用例变量 */
const CaseVar = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');

  const handleOk = () => {
    props.setIsModalOpen(false);
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  const columns = [
    {
      title: '变量名',
      copyable: true,
      dataIndex: 'varKey',
    },
  ];

  return (
    <div>
      <Modal
        title="用例变量"
        width={700}
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* <ProTable
          columns={columns}
          request={(params, sorter, filter) => {
            return queryCaseVar({ id: id });
          }}
          rowKey="key"
          options={false}
          search={false}
          pagination={false}
        /> */}
      </Modal>
    </div>
  );
};

export default CaseVar;
