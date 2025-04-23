/*
 * @Author: Menghui
 * @Date: 2025-03-15 16:41:19
 * @LastEditTime: 2025-04-10 21:56:24
 * @Description:
 */
import { Modal, Typography } from 'antd';
import JSONbig from 'json-bigint';

// 参数模板
const ParamTemplate = (props) => {
  const { Paragraph } = Typography;
  const { paramsTemplate } = props;
  const handleOk = () => {
    props.setIsModalOpen(false);
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title="参数模板"
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
            {paramsTemplate === undefined
              ? ''
              : JSON.stringify(JSONbig.parse(paramsTemplate), null, 2)}
          </pre>
        </Paragraph>
      </Modal>
    </div>
  );
};
export default ParamTemplate;
