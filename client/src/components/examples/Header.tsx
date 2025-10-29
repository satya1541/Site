import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header 
      activeTab="single" 
      onTabChange={(tab) => console.log('Tab changed:', tab)}
      isDarkMode={true}
      onThemeToggle={() => console.log('Theme toggled')}
    />
  );
}
