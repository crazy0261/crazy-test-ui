/*
 * @Author: Menghui
 * @Date: 2025-04-17 20:39:14
 * @LastEditTime: 2025-04-22 01:20:22
 * @Description: 数据大盘
 */

import { caseDetail, coreIndicatorsDetail, queryStatisticsDetail } from '@/services/charts';
import { Area, Bar, Column, DualAxes, Funnel, Gauge, Pie } from '@ant-design/charts';
import { PageContainer, ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, Collapse, DatePicker, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

const Charts = () => {
  const [range, setRange] = useState([dayjs().subtract(7, 'd'), dayjs()]);
  const [metrics, setMetrics] = useState([]);
  const [coverage, setCoverage] = useState({});
  const [userDistribution, setUserDistribution] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [caseSuccessRate, setCaseSuccessRate] = useState({});
  const [caseSuccessRatetrendData, setCaseSuccessRatetrendData] = useState([]);
  const [assetsCount, setAssetsCount] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [notTaskCount, setNotTaskCount] = useState([]);
  const [notTaskList, setNotTaskList] = useState([]);
  const [failCaseCount, setFailCaseCount] = useState([]);
  const [failCaseList, setFailCaseList] = useState([]);

  const dateRange = [
    { label: '最近7天', value: [dayjs().subtract(7, 'd'), dayjs()] },
    { label: '最近14天', value: [dayjs().subtract(14, 'd'), dayjs()] },
    { label: '最近30天', value: [dayjs().subtract(30, 'd'), dayjs()] },
    { label: '最近90天', value: [dayjs().subtract(90, 'd'), dayjs()] },
  ];
  const renderUserDistribution = (value) => {
    const dataTime = value.map((item) => dayjs(item));
    setRange(dataTime);
    renderTrendData();
  };

  const renderTrendData = () => {
    const dataTime = range.map((item) => dayjs(item).format('YYYY-MM-DD'));
    caseDetail({ startTime: dataTime[0], endTime: dataTime[1] });
  };

  // 点击事件处理函数
  const handleCardClick = (title) => {
    switch (title) {
      case '用户数':
        history.push('/userAccount');
        break;
      case '应用数':
        history.push('/application/list');
        break;
      case '接口数':
        history.push('/application/api');
        break;
      case '接口用例':
        history.push('/case/api');
        break;
      case '场景用例':
        history.push('/case/proces');
        break;
      default:
        break;
    }
  };
  const caseTrend = () => {
    const dataTime = range.map((item) => dayjs(item).format('YYYY-MM-DD'));
    caseDetail({ startTime: dataTime[0], endTime: dataTime[1] }).then((res) => {
      if (res.code === 200) {
        const data = res.data.trendData.flatMap((item) => {
          return [
            {
              date: dayjs(item.date).format('MM-DD'),
              接口用例: item.apiCaseNum,
              场景用例: item.processCaseNum,
            },
          ];
        });
        setTrendData(data);

        const caseSuccessRatetrend = res.data.caseSuccessRateData.flatMap((item) => {
          return [
            {
              Date: dayjs(item.date).format('MM-DD'),
              成功率: item.scales,
            },
          ];
        });
        setCaseSuccessRatetrendData(caseSuccessRatetrend);
      }
    });
  };

  useEffect(() => {
    caseTrend();
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

  useEffect(() => {
    coreIndicatorsDetail().then((res) => {
      if (res.code === 200) {
        const data = res.data;
        setMetrics([
          { title: '用户数', value: data.userCount },
          { title: '应用数', value: data.appCount },
          { title: '接口数', value: data.apiCount },
          { title: '总用例数', value: data.caseCount },
          { title: '接口用例', value: data.apiCaseCount },
          { title: '场景用例', value: data.processCaseCount },
          // { title: 'BUG数', value: data.bugCount },
        ]);

        setCoverage({
          coverageIsApiCount: data.coverageIsApiCount,
          coverageNotApiCount: data.coverageNotApiCount,
          coverageApiRate: data.coverageApiRate,
        });

        setCaseSuccessRate({
          caseSuccessRate: data.caseSuccessRate,
          sumCaseSuccessCount: data.sumCaseSuccessCount,
          sumCaseFailureCount: data.suCaseFailureCount,
        });

        const userDistributionEntities = res.data.userDistributionEntities.flatMap((item) => {
          return [
            {
              user: item.userName,
              type: '接口用例',
              value: item.apiCaseNum,
            },
            {
              user: item.userName,
              type: '场景用例',
              value: item.processCaseNum,
            },
          ];
        });
        setUserDistribution(userDistributionEntities);
      }
    });
  }, []);

  return (
    <PageContainer>
      {/* 筛选区 */}
      <ProCard>
        <Space>
          <RangePicker
            presets={dateRange}
            allowClear={false}
            value={range}
            onChange={(_, dateStrings) => renderUserDistribution(dateStrings)}
          />
          <Button type="primary" onClick={renderTrendData}>
            刷新
          </Button>
        </Space>
      </ProCard>

      {/* 核心指标 */}
      <ProCard
        title="核心指标"
        tooltip="统计截止全部数据"
        gutter={16}
        style={{ marginTop: 16 }}
        bordered
      >
        <Row gutter={16}>
          {metrics.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index} style={{ textAlign: 'center' }}>
              <StatisticCard
                onClick={() => handleCardClick(item.title)}
                style={{ cursor: 'pointer' }}
                statistic={{
                  title: (
                    <span
                      style={{
                        color: ['用户数', '应用数', '接口数', '接口用例', '场景用例'].includes(
                          item.title,
                        )
                          ? 'blue'
                          : 'inherit', // 默认颜色
                      }}
                    >
                      {item.title}
                    </span>
                  ),
                  value: item.value,
                }}
              />
            </Col>
          ))}
        </Row>
      </ProCard>

      {/* 用例成功率 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard title="用例成功率" tooltip="统计全部数据最新成功率" bordered>
            <Gauge
              percent={caseSuccessRate.caseSuccessRate}
              range={{
                ticks: [0, 3 / 10, 4 / 5, 1],
                color: ['#F4664A', '#FAAD14', '#30BF78'],
              }}
              indicator={{
                pointer: { style: { stroke: '#1890FF' } },
                pin: { style: { stroke: '#1890FF' } },
              }}
              height={200}
              statistic={{
                content: {
                  style: { fontSize: '24px' },
                  formatter: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
                },
              }}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <StatisticCard
                  statistic={{
                    title: '成功数',
                    value: caseSuccessRate.sumCaseSuccessCount,
                  }}
                  style={{ textAlign: 'center' }}
                />
              </Col>
              <Col span={12}>
                <StatisticCard
                  statistic={{
                    title: '失败数',
                    value: caseSuccessRate.sumCaseFailureCount,
                  }}
                />
              </Col>
            </Row>
          </ProCard>
        </Col>
        <Col span={16}>
          <ProCard title="成功率趋势图" bordered tooltip="统计累计数据 T-1">
            <Area
              data={caseSuccessRatetrendData}
              xField="Date"
              yField="成功率"
              xAxis={{
                range: [0, 1],
                tickCount: 5,
              }}
              areaStyle={() => {
                return {
                  fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                };
              }}
              height={310}
            />
          </ProCard>
        </Col>
      </Row>

      {/* 趋势与覆盖率 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard title="接口覆盖率" tooltip="统计截止全部数据" bordered>
            <Gauge
              percent={coverage.coverageApiRate}
              range={{
                ticks: [0, 3 / 10, 4 / 5, 1],
                color: ['#F4664A', '#FAAD14', '#30BF78'],
              }}
              indicator={{
                pointer: { style: { stroke: '#1890FF' } },
                pin: { style: { stroke: '#1890FF' } },
              }}
              height={200}
              statistic={{
                content: {
                  style: { fontSize: '24px' },
                  formatter: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
                },
              }}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <StatisticCard
                  statistic={{
                    title: '已覆盖接口',
                    value: coverage.coverageIsApiCount,
                  }}
                  style={{ textAlign: 'center' }}
                />
              </Col>
              <Col span={12}>
                <StatisticCard
                  statistic={{
                    title: '未覆盖接口',
                    value: coverage.coverageNotApiCount,
                  }}
                />
              </Col>
            </Row>
          </ProCard>
        </Col>
        <Col span={16}>
          <ProCard title="用例趋势图" bordered tooltip="统计累计数据 T-1">
            <DualAxes
              data={[trendData, trendData]}
              xField="date"
              yField={['接口用例', '场景用例']}
              geometryOptions={[
                { geometry: 'line', smooth: true },
                { geometry: 'line', smooth: true },
              ]}
              height={310}
            />
          </ProCard>
        </Col>
      </Row>

      {/* 人员分布 */}
      <ProCard title="人员用例分布" style={{ marginTop: 16 }} bordered>
        <Column
          data={userDistribution}
          xField="user"
          yField="value"
          seriesField="type"
          height={300}
          isGroup={true}
          scrollbar={{
            type: 'horizontal',
          }}
          minColumnWidth={20}
          maxColumnWidth={20}
          dodgePadding={2}
        />
      </ProCard>

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
    </PageContainer>
  );
};
export default Charts;
