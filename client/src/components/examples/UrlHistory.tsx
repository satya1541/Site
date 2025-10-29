import UrlHistory from '../UrlHistory';

export default function UrlHistoryExample() {
  const mockHistory = [
    {
      id: '1',
      url: 'https://google.com',
      timestamp: new Date(),
      isReachable: true,
      responseTime: 245
    },
    {
      id: '2',
      url: 'https://github.com',
      timestamp: new Date(Date.now() - 60000),
      isReachable: true,
      responseTime: 189
    },
    {
      id: '3',
      url: 'https://invalid-site-xyz.com',
      timestamp: new Date(Date.now() - 120000),
      isReachable: false,
      responseTime: 5000
    }
  ];

  return (
    <UrlHistory 
      history={mockHistory}
      onRecheck={(url) => console.log('Recheck:', url)}
      onClear={() => console.log('Clear history')}
    />
  );
}
