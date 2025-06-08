export type Post = {
  id: string;
  user: {
    name: string;
    avatar: string;
    tags: string[];
  };
  time: string;
  timestamp: number;
  title: string;
  content: string;
  stats: {
    likes: number;
    comments: number;
  };
};

export const POSTS: Post[] = [
  {
    id: '1',
    user: { name: 'Robert Tan', avatar: '🧑🏻', tags: ['Phishing', 'CPFScam', 'Verified by official sources'] },
    time: '04:32 pm',
    timestamp: new Date('2024-03-20T16:32:00').getTime(),
    title: '‼️ Fake CPF Refund SMS circulating again',
    content: 'Received this message claiming CPF refund due to system update. Link looks fishy. (cpf-update[.]xyz). Be careful – official CPF will never text clickable links.',
    stats: { likes: 120, comments: 10 },
  },
  {
    id: '2',
    user: { name: 'Janessa Ng', avatar: '👩🏻', tags: ['Ecommerce'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'Fake Carousell Seller Asking for bank OTP',
    content: 'Almost got scammed. Seller ask me to "verify payment" by giving my OTP after clicking a link. Carousell CS confirmed its a scam method. Beware of seller ABC.',
    stats: { likes: 89, comments: 7 },
  },
  {
    id: '3',
    user: { name: 'James Tan', avatar: '🧑🏻', tags: ['AskTheCommunity'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'How to verify if a QR code is safe to scan?',
    content: 'Saw a poster with a QR code for "free gifts" at the MRT station. How can I check whether its safe before scanning?',
    stats: { likes: 70, comments: 3 },
  },
  {
    id: '4',
    user: { name: 'Emily Lai', avatar: '👩🏻', tags: ['JobScam', 'Telegram'] },
    time: '12:00 am',
    timestamp: new Date('2024-03-20T00:00:00').getTime(),
    title: 'Job Scam: Part time packing',
    content: 'Congratulations, you have completed your registration! Let\'s start your learning journey next…',
    stats: { likes: 70, comments: 5 },
  },
]; 