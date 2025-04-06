import { queryByPoject, treeSave } from '@/services/tree';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tree, message } from 'antd';
import { useEffect, useState } from 'react';
import { deepTree } from '../../../common';
import AddTreeNode from './AddTreeNode';
import DelNode from './DelNode';
import UpdateNode from './UpdateNode';

const TreePage = (props) => {
  const [treeData, setTreeData] = useState([]);
  const [rightClickKey, setRightClickKey] = useState();
  const [panes, setPanes] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [rightConnect, setRightConnect] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState('0');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  useEffect(() => {
    queryByPoject().then((res) => {
      setTreeData(res.data.treeList);
    });
  }, []);

  // 点击节点
  const onSelect = (keys, { node }) => {
    props.setCurrentPage(1);
    props.actionRef.current.reload();
    const [selectedKey] = keys;
    props.setSelectedNodeName(node.titleWord);
    rightConnect && setActiveTabKey(selectedKey);
    props.setSelectedKeys(selectedKey);
    const { key, titleWord } = node;
    setPanes([...panes.filter((item) => item.key !== key), { key, title: titleWord }]);
  };

  // 展开、收起节点时触发
  const onExpand = () => {
    // console.log('Trigger Expand');
  };

  const onEdit = (targetKey, action) => {
    switch (action) {
      case 'remove':
        setPanes(panes.filter((item) => item.key !== targetKey));
        break;
    }
  };

  const onSearch = (value) => {
    setSearchWord(value);
  };

  /** 拖拽节点 */
  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setTreeData(treeData);
    if (data !== undefined && data !== null && data.length > 0) {
      treeSave({ treeData: JSON.stringify(data) }).then((res) => {
        if (res.code === 200) {
          queryByPoject().then((res) => {
            setTreeData(res.data.treeList);
          });
          message.success('移动成功');
        }
      });
    }
  };

  const menus = (node) => [
    {
      key: 'add',
      label: '新增',
      onClick: () => {
        setIsAddModalOpen(true);
      },
    },
    {
      key: 'edit',
      label: '修改',
      onClick: () => {
        setIsModModalOpen(true);
      },
    },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      onClick: () => {
        setIsDelModalOpen(true);
      },
    },
  ];

  return (
    <div style={{ marginRight: 10 }}>
      {treeData !== undefined && (
        <div>
          <Button
            type="primary"
            style={{ marginBottom: 10, width: '100%' }}
            onClick={() => {
              props.setSelectedKeys(null);
              props.setSelectedNodeName('根目录');
              setIsAddModalOpen(true);
            }}
          >
            新增根目录
          </Button>
          <Tree
            style={{ width: 250, height: 800, marginTop: 10 }}
            height={800}
            showLine
            switcherIcon={<DownOutlined />}
            blockNode
            draggable // 设置节点可拖拽
            onDrop={onDrop}
            defaultExpandAll={true} // 是否默认展开所有节点
            defaultSelectedKeys={['0']}
            onRightClick={({ node }) => {
              setRightClickKey(node.key);
              props.setSelectedKeys(node.key);
              props.setSelectedNodeName(node.titleWord);
            }}
            onSelect={onSelect}
            selectedKeys={rightConnect ? [activeTabKey] : props.selectedKeys}
            // onExpand={onExpand} // 展开、收起节点时触发
            treeData={[
              ...deepTree(treeData, (item) => {
                return {
                  ...item,
                  titleWord: item.title,
                  title: (
                    <Dropdown
                      open={rightClickKey === item.key}
                      onOpenChange={() => setRightClickKey()}
                      overlayStyle={{ width: 80 }}
                      menu={{ items: menus(item) }} // 传递菜单项数组
                    >
                      <span
                        style={
                          searchWord && item.title.includes(searchWord) ? { color: 'red' } : {}
                        }
                      >
                        {item.title}
                      </span>
                    </Dropdown>
                  ),
                };
              }),
            ]}
          />
        </div>
      )}
      <AddTreeNode
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        selectedKeys={props.selectedKeys}
        setTreeData={setTreeData}
        parentNodeName={props.selectedNodeName}
      />
      <UpdateNode
        isModalOpen={isModModalOpen}
        setIsModalOpen={setIsModModalOpen}
        selectedKeys={props.selectedKeys}
        setTreeData={setTreeData}
        selectedNodeName={props.selectedNodeName}
      />
      <DelNode
        isModalOpen={isDelModalOpen}
        setIsModalOpen={setIsDelModalOpen}
        selectedKeys={props.selectedKeys}
        setTreeData={setTreeData}
        selectedNodeName={props.selectedNodeName}
      />
    </div>
  );
};

export default TreePage;
