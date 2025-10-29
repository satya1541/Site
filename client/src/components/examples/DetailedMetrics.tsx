import DetailedMetrics from '../DetailedMetrics';

export default function DetailedMetricsExample() {
  const mockResult = {
    url: 'https://example.com',
    isReachable: true,
    responseTime: 245,
    ipAddress: "93.184.216.34",
    statusCode: 200,
    sslValid: true,
    dnsTime: 45,
    tcpTime: 120,
    tlsTime: 80
  };

  return <DetailedMetrics result={mockResult} />;
}
