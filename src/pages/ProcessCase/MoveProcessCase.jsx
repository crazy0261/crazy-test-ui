import { batchUpdateMove } from '@/services/processCase';
import { queryByPoject } from '@/services/tree';
import { DownOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { deepTree } from '../../common';

/**
 * 移动场景用例
 */
const { DirectoryTree } = Tree;
const MoveProcessCase = (props) => {
  const [isloading, setIsloading] = useState(false);
  const [treeData, setTreeData] = useState();
  const [selectedKeys, setSelectedKeys] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [rightConnect, setRightConnect] = useState(true);

  useEffect(() => {
    if (props.isModalOpen) {
      queryByPoject().then((res) => {
        setTreeData(res.data.treeList);
      });
      setActiveTabKey(null);
    }
  }, [props.isModalOpen]);

  const handleCancel = () => {
    setSelectedKeys(null);
    props.setIsModalOpen(false);
  };

  const onFinish = () => {
    if (selectedKeys === null) {
      message.warning('请选择树节点');
    } else {
      setIsloading(true);
      batchUpdateMove({
        caseIds: props.selectedCaseIds,
        treeKey: selectedKeys,
      }).then((res) => {
        setIsloading(false);
        if (res.code === 200) {
          setSelectedKeys(null);
          props.setIsModalOpen(false);
          message.success(res.message);
          props.actionRef.current.reload();
          props.setSelectedCaseIds([]);
        }
      });
    }
  };

  // 点击节点
  const onSelect = (keys, { node }) => {
    const [selectedKey] = keys;
    setSelectedKeys(selectedKey);
    rightConnect && setActiveTabKey(selectedKey);
  };

  return (
    <>
      <Modal
        title={'移动场景用例'}
        open={props.isModalOpen}
        onCancel={handleCancel}
        width={500}
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
        <Tree
          style={{ width: 460, height: 500, marginTop: 10 }}
          height={500}
          showLine={true}
          switcherIcon={<DownOutlined />}
          blockNode
          draggable={false} // 设置节点可拖拽
          defaultExpandAll={false} // 是否默认展开所有节点
          onSelect={onSelect}
          defaultSelectedKeys={null}
          selectedKeys={rightConnect ? [activeTabKey] : selectedKeys}
          treeData={[
            ...deepTree(treeData, (item) => {
              return {
                ...item,
                titleWord: item.title,
              };
            }),
          ]}
        />
      </Modal>
    </>
  );
};

export default MoveProcessCase;
