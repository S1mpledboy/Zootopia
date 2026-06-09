'use client';

import React from 'react';
import ZarzadzanieZamowieniami from './zarzadzanieZamowieniami';

interface ZarzadzanieZamowieniamiClientProps {
  initialOrders: any[];
}

const ZarzadzanieZamowieniamiClient: React.FC<ZarzadzanieZamowieniamiClientProps> = ({ initialOrders }) => {
  // Przekazujemy dane bezpośrednio do komponentu zarządzającego z obsługą filtrów i wyszukiwarki
  return <ZarzadzanieZamowieniami initialOrders={initialOrders} />;
};

export default ZarzadzanieZamowieniamiClient;