import CaseVar from '@/pages/ApiCase/ApiCaseDetail/CaseVar';
import CommonVar from '@/pages/ApiCase/ApiCaseDetail/CommonVar';
import { porcessNodeDetail, porcessNodeSave } from '@/services/processCaseNode';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Drawer, message, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 前置步骤节点 & 条件节点 编辑页
const EditConditionNode = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [commonVarModalOpen, setCommonVarModalOpen] = useState(false);
  const [caseVarModalOpen, setCaseVarModalOpen] = useState(false);

  // 节点发生变化时，查询节点详情
  useEffect(() => {
    if (props.open === true) {
      if (props.curNodeId !== undefined && props.curNodeId !== null) {
        setNodeInfo(props.curNodeId, false);
      } else {
        console.log('props.curNodeId = ', props.curNodeId);
        console.log('props.curNodeId !== undefined ', props.curNodeId !== undefined);
        console.log('props.curNodeId !== null ', props.curNodeId !== null);
      }
    }
  }, [props.open, props.curNodeId]);

  function setNodeInfo(nodeId, isCopy) {
    porcessNodeDetail({ id: nodeId }).then((res) => {
      if (res.code === 200) {
        if (isCopy === false) {
          if (res.data.id === null) {
            setIsEdit(true);
          } else {
            setIsEdit(false);
          }
        }
        formRef?.current?.setFieldsValue({
          name: res.data.name,
          groovyKey: res.data.groovyKey,
          groovyScript: res.data.groovyScript,
        });
      }
    });
  }

  // 点击保存或修改
  const handleFinish = (values) => {
    if (isEdit) {
      for (let i = 0; i < props.nodes.length; i++) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
      props.align();
      porcessNodeSave({
        id: props.curNodeId,
        caseId: caseId,
        groovyKey: values.groovyKey,
        groovyScript: values.groovyScript,
        nodes: props.nodes,
        edges: props.edges,
      }).then((res) => {
        if (res.code === 200) {
          setIsEdit(false);
          message.success('修改成功');
        }
      });
    } else {
      setIsEdit(true);
    }
  };
  const onClose = () => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['borderColor'] = 'black';
      }
    }
    props.setOpen(false);
    formRef?.current?.resetFields();
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.nodes.length; i++) {
      if (props.nodes[i]['id'] === props.curNodeId) {
        props.nodes[i]['data']['label'] = value;
      }
    }
  };

  const handlePase = () => {
    setNodeInfo(props.copyNodeId, true);
  };

  const handleCopy = () => {
    props.setCopyNodeId(props.curNodeId);
    message.success('复制成功');
  };

  return (
    <>
      <Drawer
        title="编辑条件节点"
        width={800}
        onClose={onClose}
        open={props.open}
        extra={
          <Space>
            <Tooltip title="将当前节点及下面的节点，向下移动">
              <Button type="primary" onClick={() => props.moveDown(props.curNodeId)}>
                下移
              </Button>
            </Tooltip>
            <Tooltip title="将当前节点及下面的节点，向上移动">
              <Button type="primary" onClick={() => props.moveUp(props.curNodeId)}>
                上移
              </Button>
            </Tooltip>
            <Button type="primary" disabled={isEdit} onClick={handleCopy}>
              复制
            </Button>
            <Button
              type="primary"
              onClick={handlePase}
              disabled={
                isEdit === false || props.copyNodeId === undefined || props.copyNodeId === null
                  ? true
                  : false
              }
            >
              粘贴
            </Button>
          </Space>
        }
      >
        <ProForm
          formRef={formRef}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' }, // 隐藏[重置]按钮
            },
            searchConfig: {
              submitText: isEdit ? '保存' : '编辑',
            },
          }}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="节点名"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
            onChange={(e) => {
              handleNameChange(e.target.value);
            }}
          />
          <ProFormText
            name="groovyKey"
            label="出参key"
            rules={[{ required: isEdit }]}
            disabled={!isEdit}
          />
          <Button
            size="small"
            type="primary"
            style={{ marginRight: 10, marginBottom: 5 }}
            onClick={() => setCaseVarModalOpen(true)}
          >
            用例变量
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ marginRight: 10, marginBottom: 5 }}
            onClick={() => setCommonVarModalOpen(true)}
          >
            公共变量
          </Button>
          <ProFormTextArea
            colProps={{ span: 24 }}
            name="groovyScript"
            label="出参value"
            disabled={!isEdit}
            rules={[{ required: isEdit }]}
            fieldProps={{ placeholder: '请输入groovy脚本', style: { height: 300 } }}
          />
        </ProForm>
      </Drawer>
      <CommonVar isModalOpen={commonVarModalOpen} setIsModalOpen={setCommonVarModalOpen} />
      <CaseVar isModalOpen={caseVarModalOpen} setIsModalOpen={setCaseVarModalOpen} />
    </>
  );
};

export default EditConditionNode;
