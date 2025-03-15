import { Modal, Typography } from 'antd';
import JSONbig from 'json-bigint';

// 参数模板
const ParamTemplate = (props) => {
  const { Paragraph } = Typography;
  const { requestParamsTemp } = props;
  const handleOk = () => {
    props.setIsModalOpen(false);
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title="请求参数模板"
        width={700}
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Paragraph>
          <pre
            style={{
              border: 'none',
            }}
          >
            {requestParamsTemp === undefined
              ? ''
              : JSON.stringify(JSONbig.parse(requestParamsTemp), null, 2)}
          </pre>
        </Paragraph>
      </Modal>
    </div>
  );
};
export default ParamTemplate;
