// import { createBug, getMembers, getProjects, getSprints } from '@/services/aliYun';
import { Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const CreateBug = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [projectList, setProjectList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [sprintList, setSprintList] = useState([]);
  const [curProjectId, setCurProjectId] = useState(null);
  const [isOkButtonLoading, setIsOkButtonLoading] = useState(false);
  const url = new URL(window.location.href).href;
  const subject = '';
  const description =
    '【用例地址】：' +
    formateUrl(url) +
    '<br />' +
    '【失败原因】：' +
    formateList(props.failReason) +
    '<br />' +
    '【请求参数】：' +
    formateJSON(props.requestParams) +
    '<br />' +
    '【返回结果】：' +
    formateJSON(props.responseBody) +
    '<br />';

  function formateStr(string) {
    if (string === undefined || string === null) {
      return '无';
    }
    return string;
  }

  function formateUrl(url) {
    return '<a href=' + url + '>' + url + '</a>';
  }

  function formateList(listReq) {
    if (listReq === undefined || listReq === null) {
      return '无';
    }
    if (listReq !== undefined && listReq !== null) {
      let list = Object.values(listReq);
      let result = '<ul>';
      for (let i = 0; i < list.length; i++) {
        result = result + '<li>' + list[i] + '</li>';
      }
      result = result + '</ul>';
      return result;
    }
  }

  function formateJSON(str) {
    if (str === undefined || str === null) {
      return '无';
    }
    return '<Paragraph> <pre>' + JSON.stringify(str, null, 2) + '</pre> </Paragraph>';
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setIsOkButtonLoading(true);
        // createBug(values).then((res) => {
        //   setIsOkButtonLoading(false);
        //   if (res.code === 200) {
        //     message.success('创建成功');
        //     props.setIsCreateBugOpen(false);
        //   }
        // });
        setIsOkButtonLoading(false);
      })
      .catch((info) => {
        message.error('存在必填参数为空');
      });
  };

  const handleCancel = () => {
    props.setIsCreateBugOpen(false);
  };

  const fetchProjectList = () => {
    // getProjects().then((res) => {
    //   if (res.code === 200) {
    //     setProjectList(
    //       res.data.map((item) => ({
    //         value: item.identifier,
    //         label: item.name,
    //       })),
    //     );
    //   }
    // });
  };

  const fetchMemberList = () => {
    // getMembers().then((res) => {
    //   if (res.code === 200) {
    //     setMemberList(
    //       res.data.map((item) => ({
    //         value: item.accountId,
    //         label: item.organizationMemberName,
    //       })),
    //     );
    //   }
    // });
  };

  const fetchSprintList = () => {
    // getSprints({ projectId: curProjectId }).then((res) => {
    //   if (res.code === 200) {
    //     setSprintList(
    //       res.data.map((item) => ({
    //         value: item.identifier,
    //         label: item.name,
    //       })),
    //     );
    //   }
    // });
  };

  useEffect(() => {
    if (props.isCreateBugOpen) {
      fetchProjectList();
      fetchMemberList();
    }
  }, [props.isCreateBugOpen]);

  useEffect(() => {
    if (curProjectId !== null && curProjectId !== undefined) {
      fetchSprintList();
    } else {
      setSprintList([]);
    }
  }, [curProjectId]);

  // 缺陷级别
  const levelList = [
    {
      label: '初',
      value: '初',
    },
    {
      label: '中',
      value: '中',
    },
    {
      label: '高',
      value: '高',
    },
  ];

  // 严重程度
  const seriousLevelList = [
    {
      label: '1-致命',
      value: 'a6005eca9669fd0d22697f8c04',
    },
    {
      label: '2-严重',
      value: 'add277e773de1e4d7f6e8f4288',
    },
    {
      label: '3-一般',
      value: 'ddb0b8fad71a146fd0e3f7fd6c',
    },
    {
      label: '4-轻微',
      value: 'aff3a93f70d622d797296b3b61',
    },
  ];

  // 引入端
  const fromList = [
    {
      label: '后端',
      value: '后端',
    },
    {
      label: 'Web前端',
      value: 'Web前端',
    },
    {
      label: 'H5',
      value: 'H5',
    },
    {
      label: '小程序',
      value: '小程序',
    },
    {
      label: 'Android',
      value: 'Android',
    },
    {
      label: 'IOS',
      value: 'IOS',
    },
  ];

  // 发现阶段
  const stageList = [
    {
      label: '需求阶段',
      value: '需求阶段',
    },
    {
      label: '测试阶段',
      value: '测试阶段',
    },
    {
      label: '预发阶段',
      value: '预发阶段',
    },
    {
      label: '验收阶段',
      value: '验收阶段',
    },
    {
      label: '部署阶段',
      value: '部署阶段',
    },
  ];

  const bugTypeList = [
    {
      value: '37da3a07df4d08aef2e3b393',
      label: '缺陷',
    },
    {
      value: 'bba77181ef64f834248a0175',
      label: '线上故障',
    },
  ];

  return (
    <Modal
      title="创建BUG"
      open={props.isCreateBugOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okButtonProps={{ loading: isOkButtonLoading }}
    >
      <Form
        form={form}
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item name="subject" label="标题" initialValue={subject} rules={[{ required: true }]}>
          <Input defaultValue={subject} />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true }]}
          initialValue={description}
        >
          <TextArea rows={5} defaultValue={description} />
        </Form.Item>

        <Form.Item name="assignedTo" label="负责人（开发）" rules={[{ required: true }]}>
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={memberList}
          ></Select>
        </Form.Item>

        <Form.Item name="verifier" label="验证者（测试）" rules={[{ required: true }]}>
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={memberList}
          ></Select>
        </Form.Item>

        <Form.Item name="spaceIdentifier" label="项目" rules={[{ required: true }]}>
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={projectList}
            onChange={(e) => {
              setCurProjectId(e);
            }}
          ></Select>
        </Form.Item>

        <Form.Item name="sprintIdentifier" label="迭代" rules={[{ required: false }]}>
          <Select
            showSearch
            allowClear
            placeholder="请先选择项目"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={sprintList}
          ></Select>
        </Form.Item>

        <Form.Item name="from" label="引入端" rules={[{ required: true }]} initialValue="后端">
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="后端"
            options={fromList}
          ></Select>
        </Form.Item>

        <Form.Item name="level" label="缺陷级别" rules={[{ required: true }]} initialValue="中">
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="中"
            options={levelList}
          ></Select>
        </Form.Item>

        <Form.Item
          name="seriousLevel"
          label="严重程度"
          rules={[{ required: true }]}
          initialValue={'ddb0b8fad71a146fd0e3f7fd6c'}
        >
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="ddb0b8fad71a146fd0e3f7fd6c"
            options={seriousLevelList}
          ></Select>
        </Form.Item>

        <Form.Item
          name="stage"
          label="发现阶段"
          rules={[{ required: true }]}
          initialValue={'测试阶段'}
        >
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="测试阶段"
            options={stageList}
          ></Select>
        </Form.Item>

        <Form.Item
          name="workitemTypeIdentifier"
          label="BUG类型"
          rules={[{ required: true }]}
          initialValue="37da3a07df4d08aef2e3b393"
        >
          <Select
            showSearch
            allowClear
            placeholder="请输入关键字搜索"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="37da3a07df4d08aef2e3b393"
            options={bugTypeList}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBug;
