import { list } from '@/services/envConfig';
import { ProCard } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import EnvVarComponent from './EnvVarComponent';

const SetEnvVar = (props) => {
  const [curEnv, setCurEnv] = useState('testEnv');
  const [envListName, setEnvListName] = useState([]);

  useEffect(() => {
    envList();
  }, []);

  // todo 后期改造动态
  const envList = () => {
    list({ current: 1, pageSize: 1000 }).then((result) => {
      if (result.code === 200 && result.data.length > 0) {
        setEnvListName(
          result?.data?.map((item) => {
            return item.name;
          }),
        );
      }
    });
  };

  // 同步环境变量
  const syncEnvVar = () => {
    if (curEnv === 'testEnv') {
      props.setDemoEnvParams(props.testEnvParams);
      props.setProdEnvParams(props.testEnvParams);
    } else if (curEnv === 'demoEnv') {
      props.setTestEnvParams(props.demoEnvParams);
      props.setProdEnvParams(props.demoEnvParams);
    } else if (curEnv === 'prodEnv') {
      props.setTestEnvParams(props.prodEnvParams);
      props.setDemoEnvParams(props.prodEnvParams);
    } else {
      message.error('curEnv error');
    }
  };

  return (
    <div>
      <ProCard
        tabs={{
          type: 'card',
          onChange: (key) => {
            setCurEnv(key);
          },
        }}
        style={{ marginBottom: 10 }}
        size="small"
        title="设置用例入参"
        bordered={true}
      >
        <ProCard.TabPane key="testEnv" tab="测试环境">
          <EnvVarComponent
            dataSource={props.testEnvParams}
            setDataSource={props.setTestEnvParams}
            setTestAccount={props.setTestAccountInTest}
            testAccount={props.testAccountInTest}
            isEdit={props.isEdit}
            syncEnvVar={syncEnvVar}
            needTestAccount={true}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="demoEnv" tab="Demo环境">
          <EnvVarComponent
            dataSource={props.demoEnvParams}
            setDataSource={props.setDemoEnvParams}
            setTestAccount={props.setTestAccountInDemo}
            testAccount={props.testAccountInDemo}
            isEdit={props.isEdit}
            syncEnvVar={syncEnvVar}
            needTestAccount={true}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="prodEnv" tab="生产环境">
          <EnvVarComponent
            dataSource={props.prodEnvParams}
            setDataSource={props.setProdEnvParams}
            setTestAccount={props.setTestAccountInProd}
            testAccount={props.testAccountInProd}
            isEdit={props.isEdit}
            syncEnvVar={syncEnvVar}
            needTestAccount={true}
          />
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
};

export default SetEnvVar;
