import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import AccessibilityPanel from './AccessibilityPanel';
import Button from '../ui/button/Button';

const AccessibilityButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = () => {
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <Button
        onClick={openPanel}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Abrir configuración de accesibilidad"
        title="Configuración de Accesibilidad"
      >
        <Settings className="w-4 h-4" />
        <span className="sr-only">Accesibilidad</span>
      </Button>

      <AccessibilityPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
      />
    </>
  );
};

export default AccessibilityButton;

