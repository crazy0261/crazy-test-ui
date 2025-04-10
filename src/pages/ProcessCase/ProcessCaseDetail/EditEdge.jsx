// import { modify, queryById } from '@/services/mulTestcase';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 编辑边
const EditEdge = (props) => {
  const urlParams = new URL(window.location.href).searchParams;
  const caseId = urlParams.get('id');
  const formRef = useRef();
  const [isEdit, setIsEdit] = useState(false);

  // 节点发生变化时，查询节点详情
  useEffect(() => {
    // if (props.open === true && props.curEdgeId !== undefined && props.curEdgeId !== null) {
    //   queryById({ id: caseId }).then((res) => {
    //     if (res.code === 200) {
    //       if (res.data.id === null) {
    //         setIsEdit(true);
    //       } else {
    //         setIsEdit(false);
    //       }
    //       const edgeArray = res?.data?.edgeArray;
    //       if (edgeArray !== null && edgeArray !== undefined) {
    //         for (let i = 0; i < edgeArray.length; i++) {
    //           if (edgeArray[i]['id'] === props.curEdgeId) {
    //             formRef?.current?.setFieldsValue({
    //               name: edgeArray[i]['label'],
    //             });
    //             break;
    //           }
    //         }
    //       }
    //     }
    //   });
    // }
  }, [props.open, props.curEdgeId]);

  // 点击保存或修改
  const handleFinish = (values) => {
    // if (isEdit) {
    //   for (let i = 0; i < props.nodes.length; i++) {
    //     props.nodes[i]['data']['borderColor'] = 'black';
    //   }
    //   props.align();
    //   modify({
    //     id: caseId,
    //     nodes: props.nodes,
    //     edges: props.edges,
    //   }).then((res) => {
    //     if (res.code === 200) {
    //       setIsEdit(false);
    //       message.success('修改成功');
    //     }
    //   });
    // } else {
    //   setIsEdit(true);
    // }
  };

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 0 },
  };

  const onClose = () => {
    formRef?.current?.resetFields();
    props.setOpen(false);
  };

  const handleNameChange = (value) => {
    for (let i = 0; i < props.edges.length; i++) {
      if (props.edges[i]['id'] === props.curEdgeId) {
        props.edges[i]['label'] = value;
      }
    }
  };

  return (
    <>
      <Drawer title="编辑条件节点" width={800} onClose={onClose} open={props.open}>
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
          {...formItemLayout}
          layout={'LAYOUT_TYPE_HORIZONTAL'}
          onFinish={(e) => handleFinish(e)}
        >
          <ProFormText
            name="name"
            label="边名"
            rules={[{ required: false }]}
            disabled={!isEdit}
            onChange={(e) => {
              handleNameChange(e.target.value);
            }}
          />
        </ProForm>
      </Drawer>
    </>
  );
};

export default EditEdge;
