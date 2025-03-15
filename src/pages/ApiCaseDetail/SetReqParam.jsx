import { Button, Input, message } from 'antd';
import JSONbig from 'json-bigint';
import { useState } from 'react';
// import CaseVar from './CaseVar';
// import CommonVar from './CommonVar';
// import ParamTemplate from './ParamTemplate';

// 设置请求参数
const SetReqParam = (props) => {
  const { TextArea } = Input;
  const [paramTempModelOpen, setParamTempModelOpen] = useState(false);
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);
  const urlParams = new URL(window.location.href).searchParams;
  const id = urlParams.get('id');
  const isMulCase = window.location.href.indexOf('mulTestCase') !== -1;

  const jsonFormate = () => {
    if (props.reqParams !== undefined && props.reqParams !== null) {
      try {
        let data = '';
        data = JSONbig.parse(props.reqParams);
        props.setReqParams(JSON.stringify(data, null, 4));
      } catch (e) {
        message.error('格式有误');
      }
    }
  };

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
        onClick={() => setParamTempModelOpen(true)}
        style={{ marginRight: 10, marginBottom: 5 }}
      >
        参数模板
      </Button>
      <Button size="small" type="primary" onClick={() => jsonFormate()}>
        格式化
      </Button>
      {/* <ParamTemplate
        isModalOpen={paramTempModelOpen}
        setIsModalOpen={setParamTempModelOpen}
        requestParamsTemp={props.requestParamsTemp}
      /> */}
      {/* <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} /> */}
      <TextArea
        rows={8}
        placeholder={'请输入JSON格式的请求参数'}
        style={{ width: 1000 }}
        onChange={(e) => {
          props.setReqParams(e?.currentTarget?.value);
        }}
        disabled={!props.isEdit}
        value={props.reqParams}
      />
      {/* <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} /> */}
    </div>
  );
};

export default SetReqParam;
