/*
 * @Author: Menghui
 * @Date: 2025-03-28 17:00:21
 * @LastEditTime: 2025-03-31 14:06:13
 * @Description: 任务编辑弹框
 */
import { caseTypeEnum } from '@/common';
import { save } from '@/services/taskManagement';
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 新建弹框
 */
const EditTask = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isloading, setIsloading] = useState(false);

  const handleCancel = () => {
    props.setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = () => {
    form.validateFields().then((value) => {
      setIsloading(true);
      props.recordData?.id === undefined
        ? save(value).then((result) => showResult(result, '新建'))
        : save({ ...value, id: props.recordData.id }).then((result) => showResult(result, '修改'));
    });
  };

  const showResult = (result, msg) => {
    setIsloading(false);
    if (result.code === 200) {
      message.success(msg + '成功！');
      props.actionRef.current.reload();
      props.setIsModalOpen(false);
      form.resetFields();
    }
  };

  useEffect(() => {
    props.isModalOpen &&
      props.recordData?.id &&
      form.setFieldsValue({
        name: props.recordData?.name,
        cron: props.recordData?.cron,
        testcaseType: props.recordData?.testcaseType,
        env: props.recordData?.env,
        enable: props.recordData?.enable,
        remark: props.recordData?.remark,
      });
  }, [props.isModalOpen]);

  return (
    <>
      <Modal
        title={props.recordData.id === undefined ? '新建任务' : '编辑任务'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        footer={[
          <>
            <Button type="primary" onClick={handleCancel} key={'cancel'}>
              取消
            </Button>
            <Button type="primary" onClick={onFinish} key={'submit'} loading={isloading}>
              提交
            </Button>
          </>,
        ]}
      >
        <Form
          style={{
            maxWidth: 800,
          }}
          form={form}
        >
          <Form.Item name="name" label="任务名称" rules={[{ required: true }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item
            name="cron"
            label="Cron表达式"
            tooltip="
                  corn从左到右：秒 分 时 日 月 星期 年  
                  corn每3分钟触发一次：0 0/3 * * * ?   
                  corn每1小时触发一次：0 0 * * * ? 
                  corn每天10点触发一次：0 0 10 * * ? "
          >
            <Input placeholder="请输入Cron表达式" />
          </Form.Item>

          <Form.Item name="testcaseType" label="用例类型" rules={[{ required: true }]}>
            <Select options={caseTypeEnum} placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item name="env" label="执行环境" rules={[{ required: true }]}>
            <Select options={caseTypeEnum} placeholder="请输入任务名称" />
            {/* <Select placeholder="请选择环境" /> */}
          </Form.Item>
          <Form.Item name="enable" label="是否开启" initialValue={true}>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
          </Form.Item>
          <Form.Item name="remark" label="任务描述">
            <TextArea placeholder="请输入任务描述" maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTask;
