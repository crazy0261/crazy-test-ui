/*
 * @Author: Menghui
 * @Date: 2025-04-17 20:39:14
 * @LastEditTime: 2025-04-19 15:33:56
 * @Description: 数据大盘
 */

import { caseDetail, coreIndicatorsDetail } from '@/services/charts';
import { Bar, Column, DualAxes, Funnel, Gauge, Pie } from '@ant-design/charts';
import { PageContainer, ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, Collapse, DatePicker, Row, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

// 模拟数据
const mockData = {
  // 未断言用例
  unassertedCases: [
    { user: '张三', count: 150 },
    { user: '李四', count: 80 },
    { user: '王五', count: 50 },
    { user: '王五1', count: 25 },
    { user: '王五2', count: 10 },
  ],
  unassertedDetails: [
    { id: 'C001', name: '登录接口测试', service: '用户服务', creator: '张三' },
    { id: 'C002', name: '支付接口测试', service: '支付服务', creator: '李四' },
  ],

  // 未加入定时任务
  unscheduledCases: [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他', value: 5 },
  ],
  unscheduledDetails: [
    { id: 'T001', name: '订单查询测试', type: '接口用例', owner: '张三' },
    { id: 'T002', name: '购物车场景', type: '场景用例', owner: '李四' },
  ],

  // 失败用例
  failedCases: [
    { user: '张三', 个数: 1200 },
    { user: '李四', 个数: 800 },
    { user: '张三1', 个数: 120 },
    { user: '李四2', 个数: 80 },
  ],
  failedDetails: [
    {
      id: 'F001',
      name: '库存检查',
      error: '断言失败: 期望库存=100 实际=95',
      time: '2023-06-03 14:30',
    },
    { id: 'F002', name: '支付流程', error: '接口超时: 5000ms未响应', time: '2023-06-03 15:12' },
  ],
};

const Charts = () => {
  const [range, setRange] = useState([dayjs().subtract(7, 'd'), dayjs()]);
  const [metrics, setMetrics] = useState([]);
  const [coverage, setCoverage] = useState({});
  const [userDistribution, setUserDistribution] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [caseSuccessRate, setCaseSuccessRate] = useState({});

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
              date: item.date,
              接口用例: item.apiCaseNum,
              场景用例: item.processCaseNum,
            },
          ];
        });
        setTrendData(data);
      }
    });
  };

  useEffect(() => {
    caseTrend();
  }, []);

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
          <ProCard title="用例趋势图" bordered tooltip="统计累计数据">
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

      {/* 用例成功率 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard title="用例成功率" tooltip="全部数据最新成功率" bordered>
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
          <ProCard title="成功率趋势图" bordered tooltip="统计累计数据">
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
                    data={mockData.unscheduledCases}
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
                        content: `${mockData.unscheduledCases.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        )}`,
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
                        title: '类型',
                        dataIndex: 'type',
                        render: (type) => (
                          <Tag color={type === '接口用例' ? '#096DD9' : '#1890FF'}>{type}</Tag>
                        ),
                      },
                      { title: '负责人', dataIndex: 'owner' },
                      {
                        title: '操作',
                        render: () => <a>设置定时</a>,
                      },
                    ]}
                    dataSource={mockData.unscheduledDetails}
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
                  <Funnel
                    data={mockData.unassertedCases}
                    xField="user"
                    yField="count"
                    conversionTag={{ formatter: (v) => `${v.count}个` }}
                    height={300}
                    dynamicHeight={true}
                    legend={false}
                  />
                </Col>
                <Col span={16}>
                  <ProTable
                    columns={[
                      { title: '用例ID', dataIndex: 'id' },
                      { title: '用例名称', dataIndex: 'name' },
                      { title: '所属服务', dataIndex: 'service' },
                      { title: '创建人', dataIndex: 'creator' },
                      {
                        title: '操作',
                        render: () => <a>添加断言</a>,
                      },
                    ]}
                    dataSource={mockData.unassertedDetails}
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
                  <Bar
                    data={mockData.failedCases}
                    xField="个数"
                    yField="user"
                    color="#FF4D4F"
                    height={300}
                    minBarWidth={20}
                    maxBarWidth={20}
                  />
                </Col>
                <Col span={16}>
                  <ProTable
                    columns={[
                      { title: '用例ID', dataIndex: 'id' },
                      { title: '用例名称', dataIndex: 'name' },
                      {
                        title: '错误信息',
                        dataIndex: 'error',
                        render: (error) => (
                          <Tooltip title={error}>
                            <span style={{ color: '#FF4D4F' }}>
                              {error.length > 20 ? `${error.substring(0, 20)}...` : error}
                            </span>
                          </Tooltip>
                        ),
                      },
                      { title: '失败时间', dataIndex: 'time' },
                      {
                        title: '操作',
                        render: () => <a>立即重跑</a>,
                      },
                    ]}
                    dataSource={mockData.failedDetails}
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
