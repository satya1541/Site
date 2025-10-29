import ExportButton from '../ExportButton';

export default function ExportButtonExample() {
  const mockData = {
    url: 'https://example.com',
    isReachable: true,
    responseTime: 245,
    statusCode: 200
  };

  return <ExportButton data={mockData} />;
}
