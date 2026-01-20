// tabs/TestAnswersTab.js
import React from 'react';
import { Spin, Empty, Typography, Collapse, Card, Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';

// Хуки
import { useTestResults } from '../hooks/useTestResults';

// Компоненты
import { TestStatsSummary } from '../components/TestStatsSummary';
import { TestResultHeader } from '../components/TestResultHeader';
import { TestResultExtraInfo } from '../components/TestResultExtraInfo';
import { TestResultsPanel } from '../components/TestResultsPanel';
import { QuestionSummaryCard } from '../components/QuestionSummaryCard';

const { Text } = Typography;
const { Panel } = Collapse;

export const TestAnswersTab = ({ user, userStats }) => {
  const { testResults, loading, expandedPanels, handlePanelChange } = useTestResults(user, userStats);

console.log("testResults ",testResults)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">Загрузка данных по тестам...</Text>
        </div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <Empty
        description="Нет данных по ответам на тесты"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      <TestStatsSummary testResults={testResults} />

      {/* Детали по каждому тесту */}
      <Collapse
        activeKey={expandedPanels}
        onChange={handlePanelChange}
        expandIcon={({ isActive }) => (
          <RightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        {testResults.map((result, index) => (
          <Panel
            header={<TestResultHeader result={result} />}
            key={index}
            extra={<TestResultExtraInfo result={result} />}
          >
            <TestResultsPanel result={result} />

            {/* Сводная таблица правильности ответов */}
            <Card size="small" title="Сводка по ответам" style={{ marginTop: 16 }}>
              <Row gutter={[8, 8]}>
                {result.questionAnalysis.map((item) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.questionId}>
                    <QuestionSummaryCard item={item} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};