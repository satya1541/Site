import { useState } from 'react';
import AddWebsiteDialog from '../AddWebsiteDialog';
import { Button } from '@/components/ui/button';

export default function AddWebsiteDialogExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <AddWebsiteDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={async (website) => {
          console.log('Save website:', website);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }}
      />
    </div>
  );
}
