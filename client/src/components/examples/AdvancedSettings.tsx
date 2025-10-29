import AdvancedSettings from '../AdvancedSettings';
import { useState } from 'react';

export default function AdvancedSettingsExample() {
  const [options, setOptions] = useState({
    timeout: 5000,
    followRedirects: true,
    validateSSL: true,
    customHeaders: ''
  });

  return (
    <AdvancedSettings 
      options={options}
      onOptionsChange={setOptions}
    />
  );
}
