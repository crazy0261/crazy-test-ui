/*
 * @Author: Menghui
 * @Date: 2025-04-17 20:39:14
 * @LastEditTime: 2025-04-17 23:43:16
 * @Description: 数据大盘
 */

import { coreIndicatorsDetail } from '@/services/charts';
import { Bar, Column, DualAxes, Funnel, Gauge, Pie } from '@ant-design/charts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Button, Col, Collapse, DatePicker, Row, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// 模拟数据
const mockData = {
  // 人员分布
  userDistribution: [
    { user: '张三', type: '接口用例', value: 124 },
    { user: '张三', type: '场景用例', value: 32 },
    { user: '李四', type: '接口用例', value: 98 },
    { user: '李四', type: '场景用例', value: 45 },
    { user: '王五', type: '接口用例', value: 76 },
    { user: '王五', type: '场景用例', value: 12 },
    { user: '王五1', type: '接口用例', value: 76 },
    { user: '王五1', type: '场景用例', value: 12 },
    { user: '王五2', type: '接口用例', value: 76 },
    { user: '王五2', type: '场景用例', value: 12 },
    { user: '王五3', type: '接口用例', value: 76 },
    { user: '王五3', type: '场景用例', value: 12 },
    { user: '王五4', type: '接口用例', value: 76 },
    { user: '王五4', type: '场景用例', value: 12 },
    { user: '王五5', type: '接口用例', value: 76 },
    { user: '王五5', type: '场景用例', value: 12 },
    { user: '王五6', type: '接口用例', value: 76 },
    { user: '王五6', type: '场景用例', value: 12 },
  ],

  // 趋势数据
  trendData: [
    { date: '6/1', 接口用例: 120, 场景用例: 32 },
    { date: '6/2', 接口用例: 132, 场景用例: 45 },
    { date: '6/3', 接口用例: 101, 场景用例: 28 },
    { date: '6/4', 接口用例: 10, 场景用例: 32 },
    { date: '6/5', 接口用例: 132, 场景用例: 45 },
    { date: '6/6', 接口用例: 101, 场景用例: 28 },
  ],

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
  const [range, setRange] = useState(['2023-06-01', '2023-06-03']);
  const [metrics, setMetrics] = useState([]);
  const [coverage, setCoverage] = useState({});

  const renderUserDistribution = (value) => {
    console.log('renderUserDistribution---->', value);
  };

  useEffect(() => {
    coreIndicatorsDetail().then((res) => {
      if (res.code === 200) {
        const data = res.data;
        setMetrics([
          { title: '用户数', value: data.userCount },
          { title: '应用数', value: data.appCount },
          { title: '接口数', value: data.apiCount },
          { title: 'BUG数', value: data.bugCount },
          { title: '总用例数', value: data.caseCount },
          { title: '接口用例', value: data.apiCaseCount },
          { title: '场景用例', value: data.processCaseCount },
          { title: '成功率', value: `${data.caseSuccessRate * 100}%` },
        ]);
        setCoverage({
          coverageIsApiCount: data.coverageIsApiCount,
          coverageNotApiCount: data.coverageNotApiCount,
          coverageApiRate: data.coverageApiRate,
        });
      }
    });
  }, []);

  return (
    <PageContainer
      header={{
        // title: '测试平台数据大盘',
        breadcrumb: {},
      }}
    >
      {/* 筛选区 */}
      <ProCard>
        <Space>
          <RangePicker
            value={[dayjs(range[0]), dayjs(range[1])]}
            onChange={
              (_, dateStrings) => renderUserDistribution(dateStrings)
              // setRange(dateStrings)
            }
          />
          <Button type="primary">刷新</Button>
        </Space>
      </ProCard>

      {/* 核心指标 */}
      <ProCard
        title={
          <span>
            核心指标
            <Tooltip title="统计截止当前时间数据">
              <QuestionCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </span>
        }
        gutter={16}
        style={{ marginTop: 16 }}
        bordered
      >
        <Row gutter={16}>
          {metrics.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ textAlign: 'center' }}>
              <StatisticCard
                statistic={{
                  title: item.title,
                  value: item.value,
                  valueStyle:
                    item.title === '成功率' && typeof item.value === 'string'
                      ? {
                          color:
                            parseFloat(item.value) < 80
                              ? 'red'
                              : parseFloat(item.value) >= 80
                              ? 'green'
                              : 'black',
                        }
                      : item.title === 'BUG数'
                      ? { color: 'red' }
                      : {},
                }}
              />
            </Col>
          ))}
        </Row>
      </ProCard>

      {/* 趋势与覆盖率 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard
            title={
              <span>
                接口覆盖率
                <Tooltip title="统计截止当前时间数据">
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            bordered
          >
            <Gauge
              percent={coverage.coverageApiRate}
              range={{ color: ['#FF4D4F', '#FAAD14', '#52C41A'] }}
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
          <ProCard title="每日用例新增趋势" bordered>
            <DualAxes
              data={[mockData.trendData, mockData.trendData]}
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
          data={mockData.userDistribution}
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
      <Collapse defaultActiveKey={['1', '2', '3']} style={{ marginTop: 16 }}>
        {/* 未加入定时任务 */}
        <Panel header="用例未加定时任务" key="1">
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
        </Panel>

        {/* 未断言用例 */}
        <Panel header="未断言用例 TOP 5" key="2">
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
        </Panel>

        {/* 失败用例 */}
        <Panel header="近三天用例失败 TOP 10" key="3">
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
        </Panel>
      </Collapse>
    </PageContainer>
  );
};
export default Charts;
