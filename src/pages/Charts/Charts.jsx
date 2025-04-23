/*
 * @Author: Menghui
 * @Date: 2025-04-17 20:39:14
 * @LastEditTime: 2025-04-22 21:18:38
 * @Description: 数据大盘
 */

import { caseDetail, coreIndicatorsDetail } from '@/services/charts';
import { Area, Column, DualAxes, Gauge } from '@ant-design/charts';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import StatisticsDetail from './StatisticsDetail';
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
    caseTrend(value);
  };

  const renderTrendData = () => {
    caseTrend();
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
  const caseTrend = (value) => {
    let dataTime = range.map((item) => dayjs(item).format('YYYY-MM-DD'));
    if (value !== undefined && value !== null) {
      dataTime = value;
    }
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
      <StatisticsDetail />
    </PageContainer>
  );
};
export default Charts;
