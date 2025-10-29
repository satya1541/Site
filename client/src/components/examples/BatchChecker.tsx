import BatchChecker from '../BatchChecker';

export default function BatchCheckerExample() {
  return (
    <BatchChecker 
      onCheck={(urls) => console.log('Checking URLs:', urls)}
      isLoading={false}
    />
  );
}
