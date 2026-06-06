export interface OrderItem {
  id: string;
  brand: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'ukończone' | 'w trakcie' | 'anulowane' | 'wysłane';
  date: string;
  endDate: string;
  totalCost: string;
  invoiceNumber: string;
  deliveryCost: string;
  customerType: 'osoba prywatna' | 'firma';
  customerName: string;
  address: string;
  zipCode: string;
  city: string;
  deliveryMethod: string;
  companyName: string;
  nip: string;
  paymentMethod: string;
  items: OrderItem[];
}

export const mockOrdersData: Order[] = [
  {
    id: '1',
    orderNumber: '1111',
    status: 'ukończone',
    date: '29 KWIETNIA 2026',
    endDate: '03 maja 2026',
    totalCost: '478,00',
    invoiceNumber: 'FV2600001',
    deliveryCost: 'darmowa',
    customerType: 'osoba prywatna',
    customerName: 'jan kowalski',
    address: 'jANA MATEJKI 16/20',
    zipCode: '91-402',
    city: 'Łódź',
    deliveryMethod: 'kurier',
    companyName: '---',
    nip: '---',
    paymentMethod: 'Przelew',
    items: [
      { id: 'i1', brand: 'ALPHAWOLF', name: 'AlphaWolf 15kg Sucha Karma Dla Dorosłych Psów...', quantity: 2, price: '358,00 zł' },
      { id: 'i2', brand: 'ALPHAWOLF', name: 'AlphaWolf 400g Karma Mokra Monobiałkowa...', quantity: 3, price: '100,00 zł' },
      { id: 'i3', brand: 'ALPHAWOLF', name: 'AlphaWolf 400g Sucha Karma Dla Dorosłych Ps...', quantity: 1, price: '20,00 zł' }
    ]
  },
  {
    id: '2',
    orderNumber: '1112',
    status: 'w trakcie',
    date: '29 KWIETNIA 2026',
    endDate: '---',
    totalCost: '200,00',
    invoiceNumber: 'FV2600002',
    deliveryCost: '15,00',
    customerType: 'firma',
    customerName: 'Anna Nowak',
    address: 'Piotrkowska 100',
    zipCode: '90-004',
    city: 'Łódź',
    deliveryMethod: 'paczkomat',
    companyName: 'Nowak s.c.',
    nip: '1234567890',
    paymentMethod: 'BLIK',
    items: [
      { id: 'i4', brand: 'ALPHAWOLF', name: 'AlphaWolf 400g Karma Mokra Monobiałkowa...', quantity: 6, price: '200,00 zł' }
    ]
  },
  {
    id: '3',
    orderNumber: '1112',
    status: 'anulowane',
    date: '29 KWIETNIA 2026',
    endDate: '---',
    totalCost: '200,00',
    invoiceNumber: 'FV2600002',
    deliveryCost: '15,00',
    customerType: 'firma',
    customerName: 'Anna Nowak',
    address: 'Piotrkowska 100',
    zipCode: '90-004',
    city: 'Łódź',
    deliveryMethod: 'paczkomat',
    companyName: 'Nowak s.c.',
    nip: '1234567890',
    paymentMethod: 'BLIK',
    items: [
      { id: 'i4', brand: 'ALPHAWOLF', name: 'AlphaWolf 400g Karma Mokra Monobiałkowa...', quantity: 6, price: '200,00 zł' }
    ]
  },
  {
    id: '4',
    orderNumber: '1112',
    status: 'wysłane',
    date: '29 KWIETNIA 2026',
    endDate: '---',
    totalCost: '200,00',
    invoiceNumber: 'FV2600002',
    deliveryCost: '15,00',
    customerType: 'firma',
    customerName: 'Anna Nowak',
    address: 'Piotrkowska 100',
    zipCode: '90-004',
    city: 'Łódź',
    deliveryMethod: 'paczkomat',
    companyName: 'Nowak s.c.',
    nip: '1234567890',
    paymentMethod: 'BLIK',
    items: [
      { id: 'i4', brand: 'ALPHAWOLF', name: 'AlphaWolf 400g Karma Mokra Monobiałkowa...', quantity: 6, price: '200,00 zł' }
    ]
  }
];