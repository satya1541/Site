import UrlCheckInput from '../UrlCheckInput';

export default function UrlCheckInputExample() {
  return (
    <UrlCheckInput 
      onCheck={(url) => console.log('Checking URL:', url)} 
      isLoading={false}
    />
  );
}
