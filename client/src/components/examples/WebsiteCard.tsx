import WebsiteCard from '../WebsiteCard';

export default function WebsiteCardExample() {
  const mockWebsite = {
    id: '1',
    name: 'Google',
    url: 'https://google.com',
    createdAt: new Date()
  };

  const mockStatus = {
    isReachable: true,
    responseTime: 145,
    statusCode: 200,
    checkedAt: new Date()
  };

  return (
    <div className="space-y-4">
      <WebsiteCard
        website={mockWebsite}
        status={mockStatus}
        onCheck={(id) => console.log('Check:', id)}
        onEdit={(website) => console.log('Edit:', website)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  );
}
