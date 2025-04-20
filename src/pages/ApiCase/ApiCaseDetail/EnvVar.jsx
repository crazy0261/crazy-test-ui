/*
 * @Author: Menghui
 * @Date: 2025-03-22 20:03:28
 * @LastEditTime: 2025-04-20 00:53:30
 * @Description:
 */
import { ProCard } from '@ant-design/pro-components';
import EnvVarComponent from './EnvVarComponent';

const EnvVar = (props) => {
  const { isEdit, envData, envParams, updateEnvParams, updateTestAccount } = props;

  return (
    <ProCard
      tabs={{
        type: 'card',
        onChange: (key) => {
          // 可以在这里处理选项卡切换的逻辑
        },
      }}
      style={{ marginBottom: 10 }}
      size="small"
      title="设置用例入参"
      bordered={true}
    >
      {envData.map((env) => (
        <ProCard.TabPane key={env.value} tab={env.label}>
          <EnvVarComponent
            dataSource={envParams[env.value]?.params || []}
            setDataSource={(newParams) => updateEnvParams(env.value, newParams)}
            testAccount={envParams[env.value]?.testAccount || ''}
            setTestAccount={(newTestAccount) => updateTestAccount(env.value, newTestAccount)}
            isEdit={isEdit}
            needTestAccount={true}
          />
        </ProCard.TabPane>
      ))}
    </ProCard>
  );
};

export default EnvVar;
