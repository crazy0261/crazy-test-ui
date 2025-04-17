import { Bar, Column, DualAxes, Funnel, Gauge, Pie } from '@ant-design/charts';
import { PageContainer, ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Button, Col, Collapse, DatePicker, Row, Select, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// 模拟数据
const mockData = {
  // 核心指标
  metrics: {
    userCount: 1243,
    appCount: 28,
    apiCount: 356,
    totalCases: 4821,
    apiCases: 3520,
    sceneCases: 1301,
    successRate: 92.5,
    bugCount: 12,
  },

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

  // 覆盖率
  coverage: {
    total: 356,
    covered: 294,
    rate: 0.825,
  },

  // 未断言用例
  unassertedCases: [
    { user: '张三', count: 15 },
    { user: '李四', count: 8 },
    { user: '王五', count: 5 },
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
  const [service, setService] = useState();

  // 核心指标配置
  const metrics = [
    { title: '用户数', value: mockData.metrics.userCount, trend: 'up' },
    { title: '应用数', value: mockData.metrics.appCount, trend: 'down' },
    { title: '接口数', value: mockData.metrics.apiCount, trend: 'up' },
    { title: 'BUG数', value: `${mockData.metrics.bugCount}`, trend: '' },
    { title: '总用例数', value: mockData.metrics.totalCases, trend: 'down' },
    { title: '接口用例', value: mockData.metrics.apiCases, trend: 'up' },
    { title: '场景用例', value: mockData.metrics.sceneCases, trend: 'down' },
    { title: '成功率', value: `${mockData.metrics.successRate}%`, trend: 'up' },
  ];

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
            onChange={(_, dateStrings) => setRange(dateStrings)}
          />
          <Select
            placeholder="选择服务"
            style={{ width: 200 }}
            options={[
              { label: '用户服务', value: 'user' },
              { label: '订单服务', value: 'order' },
            ]}
            value={service}
            onChange={setService}
          />
          <Button type="primary">刷新</Button>
        </Space>
      </ProCard>

      {/* 核心指标 */}
      <ProCard title="核心指标" gutter={16} style={{ marginTop: 16 }} bordered>
        <Row gutter={16}>
          {metrics.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ textAlign: 'center' }}>
              <StatisticCard
                statistic={{
                  title: item.title,
                  value: item.value,
                  trend: item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : '',
                }}
              />
            </Col>
          ))}
        </Row>
      </ProCard>

      {/* 趋势与覆盖率 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard title="接口覆盖率" bordered>
            <Gauge
              percent={mockData.coverage.rate}
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
                    title: '总接口数',
                    value: mockData.coverage.total,
                  }}
                  style={{ textAlign: 'center' }}
                />
              </Col>
              <Col span={12}>
                <StatisticCard
                  statistic={{
                    title: '未覆盖接口',
                    value: mockData.coverage.total - mockData.coverage.covered,
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
        <Panel header="未断言用例TOP5" key="2">
          <Row gutter={16}>
            <Col span={8}>
              <Funnel
                data={mockData.unassertedCases}
                xField="user"
                yField="count"
                conversionTag={{ formatter: (v) => `${v.count}个` }}
                color={['#1890FF', '#40A9FF', '#69C0FF', '#006EDC', '#0052D9']}
                height={300}
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
        <Panel header="近三天用例失败TOP5" key="3">
          <Row gutter={16}>
            <Col span={8}>
              <Bar
                data={mockData.failedCases}
                xField="个数"
                yField="user"
                color="#FF4D4F"
                height={300}
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
