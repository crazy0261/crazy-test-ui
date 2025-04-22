import { queryStatisticsDetail } from '@/services/charts';
import { Bar, Funnel, Pie } from '@ant-design/charts';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Col, Collapse, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';

const StatisticsDetail = () => {
  const [assetsCount, setAssetsCount] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [notTaskCount, setNotTaskCount] = useState([]);
  const [notTaskList, setNotTaskList] = useState([]);
  const [failCaseCount, setFailCaseCount] = useState([]);
  const [failCaseList, setFailCaseList] = useState([]);

  useEffect(() => {
    chartData();
  }, []);

  const assetsCountMap = (value) => {
    const data = value.map((item) => ({
      ...item,
      count: item.count || 0,
    }));
    setAssetsCount(data);
  };

  // 未有断言数据
  const assetsListMap = (value) => {
    const assetsListData = value.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: item.type === 'API_CASE' ? '接口用例' : '场景用例',
        nodeName: item.nodeName === null ? '-' : item.nodeName,
        ownerName: item.ownerName,
      };
    });
    setAssetsList(assetsListData);
  };

  // 未加入定时任务
  const notTaskCountMap = (value) => {
    const notTaskCountData = value.map((item) => {
      return {
        type: item.appName,
        value: item.count || 0,
      };
    });
    setNotTaskCount(notTaskCountData);
  };

  const notTaskListMap = (value) => {
    const notTaskListData = value.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: item.type === 'API_CASE' ? '接口用例' : '场景用例',
        ownerName: item.ownerName,
      };
    });
    setNotTaskList(notTaskListData);
  };

  // 失败用例数据
  const failCaseCountMap = (value) => {
    const failCaseCountData = value.map((item) => {
      return {
        name: item.name,
        总数: item.count || 0,
      };
    });
    setFailCaseCount(failCaseCountData);
  };
  const failCaseListMap = (value) => {
    const failCaseListData = value.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: item.type === 'API_CASE' ? '接口用例' : '场景用例',
        ownerName: item.ownerName,
      };
    });
    setFailCaseList(failCaseListData);
  };

  const chartData = () => {
    queryStatisticsDetail().then((res) => {
      const data = res.data;

      assetsCountMap(data.assetsCount);
      assetsListMap(data.assetsList);

      notTaskCountMap(data.notTaskCount);
      notTaskListMap(data.notTaskList);

      failCaseCountMap(data.failCaseCount);
      failCaseListMap(data.failCaseList);
    });
  };

  const handleDetailClick = (record) => {
    if (record.type === '接口用例') {
      history.push(`/case/api/detail?id=${record.id}`);
    } else {
      history.push(`/case/proces/detail?id=${record.id}`);
    }
  };

  return (
    <div>
      {/* 问题追踪 */}
      <Collapse
        defaultActiveKey={['1', '2', '3']}
        style={{ marginTop: 16 }}
        items={[
          {
            key: '1',
            label: '用例未加定时任务',
            children: (
              <Row gutter={16}>
                <Col span={8}>
                  <Pie
                    data={notTaskCount}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    innerRadius={0.6}
                    height={300}
                    label={{
                      type: 'inner',
                      offset: '-50%',
                      content: ({ percent }) => {
                        const value = parseFloat(percent) * 100;
                        return `${value % 1 === 0 ? value : value.toFixed(1)}%`;
                      },
                      style: {
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                      },
                    }}
                    tooltip={{
                      fields: ['user', 'type', 'value', 'percent'],
                      formatter: (datum) => ({
                        name: `${datum.type}`,
                        value: `${datum.value}`,
                      }),
                    }}
                    statistic={{
                      title: {
                        style: { color: 'rgba(7, 7, 7, 0.85)' },
                        content: '用例数',
                      },
                      content: {
                        style: { color: 'rgba(7, 7, 7, 0.85)', fontSize: 20 },
                        content: `${notTaskCount.reduce((sum, item) => sum + item.value, 0)}`,
                        // content: `${100}`,
                      },
                    }}
                    interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
                  />
                </Col>
                <Col span={16}>
                  <ProTable
                    columns={[
                      { title: '用例ID', dataIndex: 'id' },
                      { title: '用例名称', dataIndex: 'name' },
                      {
                        title: '用例类型',
                        dataIndex: 'type',
                        render: (type) => (
                          <Tag color={type === '接口用例' ? '#4CAF50' : '#1890FF'}>{type}</Tag>
                        ),
                      },
                      { title: '负责人', dataIndex: 'ownerName' },
                      {
                        title: '操作',
                        render: (text, record) => (
                          <a onClick={() => handleDetailClick(record)}>详情</a>
                        ),
                      },
                    ]}
                    dataSource={notTaskList}
                    rowKey="id"
                    search={false}
                    pagination={false}
                  />
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            label: '未断言用例 TOP 5',
            children: (
              <Row gutter={16}>
                <Col span={8}>
                  {assetsCount.length > 0 && (
                    <Funnel
                      data={assetsCount}
                      xField="name"
                      yField="count"
                      conversionTag={{ formatter: (v) => `${v.count}个` }}
                      height={300}
                      dynamicHeight={true}
                      legend={false}
                    />
                  )}
                </Col>
                <Col span={16}>
                  <ProTable
                    columns={[
                      { title: '用例ID', dataIndex: 'id' },
                      {
                        title: '用例类型',
                        dataIndex: 'type',
                        render: (type) => (
                          <Tag color={type === '接口用例' ? '#4CAF50' : '#1890FF'}>{type}</Tag>
                        ),
                      },
                      { title: '用例名称', dataIndex: 'name' },
                      { title: '节点名称', dataIndex: 'nodeName' },
                      { title: '负责人', dataIndex: 'ownerName' },
                      {
                        title: '操作',
                        render: (text, record) => (
                          <a onClick={() => handleDetailClick(record)}>详情</a>
                        ),
                      },
                    ]}
                    dataSource={assetsList}
                    rowKey="id"
                    search={false}
                    pagination={false}
                  />
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            label: '近三天用例失败 TOP 10',
            children: (
              <Row gutter={16}>
                <Col span={8}>
                  {failCaseCount.length > 0 && (
                    <Bar
                      data={failCaseCount}
                      xField="总数"
                      yField="name"
                      color="#FF4D4F"
                      height={300}
                      minBarWidth={20}
                      maxBarWidth={20}
                    />
                  )}
                </Col>
                <Col span={16}>
                  <ProTable
                    columns={[
                      { title: '用例ID', dataIndex: 'id' },
                      {
                        title: '用例类型',
                        dataIndex: 'type',
                        render: (type) => (
                          <Tag color={type === '接口用例' ? '#4CAF50' : '#1890FF'}>{type}</Tag>
                        ),
                      },
                      { title: '用例名称', dataIndex: 'name' },
                      { title: '负责人', dataIndex: 'ownerName' },
                      {
                        title: '操作',
                        render: (text, record) => (
                          <a onClick={() => handleDetailClick(record)}>详情</a>
                        ),
                      },
                    ]}
                    dataSource={failCaseList}
                    rowKey="id"
                    search={false}
                    pagination={false}
                  />
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default StatisticsDetail;
