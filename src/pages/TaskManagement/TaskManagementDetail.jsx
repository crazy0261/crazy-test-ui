import { listAllEnvName } from '@/services/envConfig';
import { add, modify, queryById } from '@/services/taskManagement';
import { ProForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Breadcrumb, Button, Drawer, Layout, message, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import RecordList from './RecordList';
import SelectApiTestCase from './SelectApiTestCase';
import SelectMulTestCase from './SelectMulTestCase';

// 定时任务新建、编辑、执行记录
const TaskManagementDetail = () => {
  const { Header, Content } = Layout;
  const formRef = useRef();
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [envNameEnum, setEnvNameEnum] = useState([]);
  const [open, setOpen] = useState(false);
  const path = new URL(window.location.href).pathname;
  const scheduleId = Number.parseInt(path.split('/').pop());
  const [editDisabled, setEditDisabled] = useState(scheduleId); // 默认不可编辑
  const [testcaseType, setTestcaseType] = useState(null);
  const [isAllTestCase, setIsAllTestCase] = useState(false);

  const caseTypeEnum = [
    {
      value: 'API_CASE',
      label: '接口用例',
    },
    {
      value: 'MUL_CASE',
      label: '场景用例',
    },
  ];

  const headerStyle = {
    height: 180,
    backgroundColor: 'transparent',
    marginTop: 20,
  };
  const contentStyle = {
    minHeight: 100,
    lineHeight: '100px',
    backgroundColor: 'transparent',
    marginRight: 15,
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    message.success('已选择' + selectedCaseIds.length + '个用例，请点击【保存】');
    setOpen(false);
  };

  const requestEnvNameEnum = () => {
    listAllEnvName().then((result) => {
      if (result.code === 200) {
        setEnvNameEnum(result.data.map((item) => ({ value: item.id + '', label: item.name })));
      } else {
        message.error('查询环境名称列表失败');
      }
    });
  };

  const requestScheduleDetail = () => {
    if (scheduleId) {
      queryById({ id: scheduleId }).then((res) => {
        if (res.code === 200) {
          if (res.data.testcaseList !== '' && res.data.testcaseList !== 'ALL') {
            let testcaseList = [];
            const testcaseListString = res.data.testcaseList.split(',');
            for (let i = 0; i < testcaseListString.length; i++) {
              testcaseList.push(Number.parseInt(testcaseListString[i]));
            }
            setSelectedCaseIds(testcaseList);
          }
          formRef?.current?.setFieldsValue({
            name: res.data.name,
            env: res.data.env,
            cron: res.data.cron,
            enable: res.data.enable,
            remark: res.data.remark,
            testcaseType: res.data.testcaseType,
            allTestCase: res.data.testcaseList === 'ALL',
          });
          setTestcaseType(res.data.testcaseType);
          setIsAllTestCase(res.data.testcaseList === 'ALL');
        }
      });
    }
  };

  useEffect(() => {
    requestEnvNameEnum();
    requestScheduleDetail();
  }, []);

  // 点击保存或修改
  const handleFinish = (values) => {
    if (editDisabled) {
      setEditDisabled(false);
    } else {
      if (scheduleId) {
        modify({
          ...values,
          testcaseList: isAllTestCase ? 'ALL' : selectedCaseIds.toString(),
          id: scheduleId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            setEditDisabled(true);
          }
        });
      } else {
        add({ ...values, testcaseList: isAllTestCase ? 'ALL' : selectedCaseIds.toString() }).then(
          (res) => {
            if (res.code === 200) {
              message.success('新增成功');
              setEditDisabled(true);
              history.push('/schedule/detail/' + res.data.id);
            }
          },
        );
      }
    }
  };

  const onChangeCaseType = (e) => {
    if (e !== testcaseType) {
      setSelectedCaseIds([]);
    }
    setTestcaseType(e);
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 10 }}
        items={[
          {
            title: <a href="/schedule">定时任务列表</a>,
          },
          {
            title: '任务详情',
          },
        ]}
      />
      <Drawer
        title={testcaseType === 'API_CASE' ? '选择接口用例' : '选择场景用例'}
        placement="right"
        onClose={onClose}
        open={open}
        size="large"
      >
        {testcaseType === 'API_CASE' && (
          <SelectApiTestCase
            setOpen={setOpen}
            selectedCaseIds={selectedCaseIds}
            setSelectedCaseIds={setSelectedCaseIds}
          />
        )}
        {testcaseType === 'MUL_CASE' && (
          <SelectMulTestCase
            setOpen={setOpen}
            selectedCaseIds={selectedCaseIds}
            setSelectedCaseIds={setSelectedCaseIds}
          />
        )}
      </Drawer>

      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
        size={[0, 48]}
      >
        <Layout>
          <Header style={headerStyle}>
            <ProForm
              formRef={formRef}
              labelWidth="auto"
              layout={'horizontal'}
              onFinish={(e) => handleFinish(e)}
              submitter={{
                resetButtonProps: {
                  style: { display: 'none' }, // 隐藏[重置]按钮
                },
                searchConfig: {
                  submitText: editDisabled ? '编辑' : '保存',
                },
              }}
            >
              <ProForm.Group>
                <ProFormText
                  name="name"
                  label="任务名称"
                  placeholder="请输入"
                  rules={[{ required: true }]}
                  disabled={editDisabled}
                  width={230}
                />
                <ProFormText
                  name="cron"
                  label="corn表达式"
                  placeholder="请输入"
                  rules={[{ required: true }]}
                  disabled={editDisabled}
                  width={200}
                  tooltip="
                  corn从左到右：秒 分 时 日 月 星期 年  
                  corn每3分钟触发一次：0 0/3 * * * ?   
                  corn每1小时触发一次：0 0 * * * ? 
                  corn每天10点触发一次：0 0 10 * * ? "
                />
                <ProFormSelect
                  name="enable"
                  label="是否启用"
                  rules={[{ required: true }]}
                  disabled={editDisabled}
                  width={100}
                  options={[
                    {
                      value: 1,
                      label: '启用',
                    },
                    {
                      value: 0,
                      label: '禁用',
                    },
                  ]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  options={envNameEnum}
                  name="env"
                  width={130}
                  label="执行环境"
                  rules={[{ required: true }]}
                  disabled={editDisabled}
                />
                <ProFormSelect
                  allowClear={false}
                  options={caseTypeEnum}
                  name="testcaseType"
                  width={130}
                  label="用例类型"
                  rules={[{ required: true }]}
                  disabled={editDisabled}
                  onChange={(e) => onChangeCaseType(e)}
                />
                <ProFormText
                  name="remark"
                  label="备注"
                  width={200}
                  placeholder="请输入"
                  rules={[{ required: false }]}
                  disabled={editDisabled}
                />
                <ProFormSwitch
                  label="全部用例"
                  name="allTestCase"
                  disabled={editDisabled}
                  onChange={(e) => setIsAllTestCase(e)}
                />
                <ProForm.Group>
                  <Button
                    type="primary"
                    onClick={showDrawer}
                    disabled={editDisabled || testcaseType === null || isAllTestCase}
                  >
                    选择用例
                  </Button>
                  <b>已选择{isAllTestCase ? '全部' : selectedCaseIds.length + '个'}用例</b>
                </ProForm.Group>
                、
              </ProForm.Group>
            </ProForm>
          </Header>

          <Content style={contentStyle}>
            <RecordList />
          </Content>
        </Layout>
      </Space>
    </>
  );
};

export default TaskManagementDetail;
