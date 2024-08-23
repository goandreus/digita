interface Movement {
  id: number;
  date: string;
  currency: string;
  amount: number;
  fAmount: string;
}

interface Favorite {
  id: number;
  title: string;
  accountNumber: string;
  lastMovements: Movement[];
}

export const favorites: Favorite[] = [
  {
    id: 1,
    title: 'Tío Juan cta. Ahorros',
    accountNumber: '0000000000004782',
    lastMovements: [
      {
        id: 1,
        date: '17 mayo, 04:00 p.m.',
        amount: 100,
        currency: 'S/',
        fAmount: '100.00',
      },
      {
        id: 2,
        date: '16 mayo, 05:56 p.m.',
        amount: 4400,
        currency: 'S/',
        fAmount: '4.400.00',
      },
      {
        id: 3,
        date: '15 mayo, 06:32 p.m.',
        amount: 780,
        currency: 'S/',
        fAmount: '780.00',
      },
    ],
  },
  {
    id: 2,
    title: 'Hermana cta. Interbank',
    accountNumber: '0000000000004785',
    lastMovements: [
      {
        id: 4,
        date: '17 mayo, 04:00 p.m.',
        amount: 200,
        currency: 'S/',
        fAmount: '200.00',
      },
      {
        id: 5,
        date: '16 mayo, 05:56 p.m.',
        amount: 400,
        currency: 'S/',
        fAmount: '400.00',
      },
      {
        id: 6,
        date: '15 mayo, 06:32 p.m.',
        amount: 1780,
        currency: 'S/',
        fAmount: '1.780.00',
      },
    ],
  },
];
