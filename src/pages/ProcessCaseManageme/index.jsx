/*
 * @Author: Menghui
 * @Date: 2025-03-31 23:48:10
 * @LastEditTime: 2025-04-05 15:07:52
 * @Description: 场景用例列表
 */
import { useRef, useState } from 'react';
import ProcessCaseList from './ProcessCaseList';
import TreePage from './Tree';

const App = () => {
  const actionRef = useRef();
  const [selectedKeys, setSelectedKeys] = useState(null);
  const [selectedNodeName, setSelectedNodeName] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <TreePage
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          selectedNodeName={selectedNodeName}
          setSelectedNodeName={setSelectedNodeName}
          actionRef={actionRef}
          setCurrentPage={setCurrentPage}
        />
        <div style={{ width: 'calc(100% - 250px)' }}>
          <ProcessCaseList
            actionRef={actionRef}
            selectedKeys={selectedKeys}
            selectedNodeName={selectedNodeName}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
