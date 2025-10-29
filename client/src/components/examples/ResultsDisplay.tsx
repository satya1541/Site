import ResultsDisplay from '../ResultsDisplay';

export default function ResultsDisplayExample() {
  const mockResult = {
    isReachable: true,
    responseTime: 245,
    ipAddress: "142.250.185.46",
    statusCode: 200,
    sslValid: true
  };

  return <ResultsDisplay result={mockResult} />;
}
