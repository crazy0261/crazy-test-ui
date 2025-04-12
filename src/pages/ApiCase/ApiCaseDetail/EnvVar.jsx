/*
 * @Author: Menghui
 * @Date: 2025-03-22 20:03:28
 * @LastEditTime: 2025-04-12 12:28:22
 * @Description:
 */
import { envAppList } from '@/services/envConfig';
import { ProCard } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import EnvVarComponent from './EnvVarComponent';

const EnvVar = (props) => {
  const [curEnv, setCurEnv] = useState(null);
  const [envListName, setEnvListName] = useState([]);
  const [env, setEnv] = useState([]);

  useEffect(() => {
    if (props.isAppid) {
      appIdListData(props.isAppid);
    }
  }, []);

  const appIdListData = (value) => {
    envAppList({ appId: value }).then((result) => {
      if (result.code === 200) {
        const envData = result.data.map((item) => {
          return {
            key: item.envId,
            label: item.envName,
          };
        });
        setEnv(envData);

        if (envData.length > 0) {
          setCurEnv(envData[0].key);
        }
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
        {env.map((item) => (
          <ProCard.TabPane key={item.key} tab={item.label}>
            <EnvVarComponent
              envId={item.key}
              dataSource={props.testEnvParams}
              setDataSource={props.setTestEnvParams}
              setTestAccount={props.setTestAccountInTest}
              testAccount={props.testAccountInTest}
              isEdit={props.isEdit}
              syncEnvVar={syncEnvVar}
              needTestAccount={true}
            />
          </ProCard.TabPane>
        ))}
      </ProCard>
    </div>
  );
};

export default EnvVar;
