export type Comment = {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  likes: number;
};

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
  comments: Comment[];
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
    comments: [
      {
        id: '1',
        user: { name: 'Sarah Tan', avatar: '👩🏻' },
        content: 'Thanks for sharing! I received this too. The link definitely looks suspicious.',
        time: '04:35 pm',
        likes: 5,
      },
      {
        id: '2',
        user: { name: 'Alex Wong', avatar: '🧑🏻' },
        content: 'CPF will never send SMS with links. Always verify through official CPF website.',
        time: '04:40 pm',
        likes: 8,
      },
      {
        id: '3',
        user: { name: 'Michelle Lee', avatar: '👩🏻' },
        content: "I reported this to the police. They confirmed it's a known scam.",
        time: '04:45 pm',
        likes: 12,
      },
      {
        id: '4',
        user: { name: 'David Chen', avatar: '🧑🏻' },
        content: 'Good catch! Everyone should be aware of these scams.',
        time: '04:50 pm',
        likes: 3,
      },
      {
        id: '5',
        user: { name: 'Emma Lim', avatar: '👩🏻' },
        content: 'I almost clicked the link. Thanks for the warning!',
        time: '04:55 pm',
        likes: 6,
      },
    ],
  },
  {
    id: '2',
    user: { name: 'Janessa Ng', avatar: '👩🏻', tags: ['Ecommerce'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'Fake Carousell Seller Asking for bank OTP',
    content: 'Almost got scammed. Seller ask me to "verify payment" by giving my OTP after clicking a link. Carousell CS confirmed its a scam method. Beware of seller ABC.',
    stats: { likes: 89, comments: 7 },
    comments: [
      {
        id: '1',
        user: { name: 'John Tan', avatar: '🧑🏻' },
        content: 'This happened to me too! The seller asked for OTP claiming it was for "verification".',
        time: '04:35 pm',
        likes: 4,
      },
      {
        id: '2',
        user: { name: 'Lisa Ng', avatar: '👩🏻' },
        content: 'Never share OTP with anyone, even if they claim to be from the platform.',
        time: '04:40 pm',
        likes: 7,
      },
    ],
  },
  {
    id: '3',
    user: { name: 'James Tan', avatar: '🧑🏻', tags: ['AskTheCommunity'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'How to verify if a QR code is safe to scan?',
    content: 'Saw a poster with a QR code for "free gifts" at the MRT station. How can I check whether its safe before scanning?',
    stats: { likes: 70, comments: 3 },
    comments: [
      {
        id: '1',
        user: { name: 'Peter Wong', avatar: '🧑🏻' },
        content: 'You can use QR code scanners that check for malicious links before opening them.',
        time: '04:35 pm',
        likes: 9,
      },
      {
        id: '2',
        user: { name: 'Rachel Lee', avatar: '👩🏻' },
        content: 'If it seems too good to be true, it probably is. Better to be safe than sorry.',
        time: '04:40 pm',
        likes: 5,
      },
      {
        id: '3',
        user: { name: 'Tommy Chen', avatar: '🧑🏻' },
        content: 'I use Google Lens to scan QR codes - it shows the URL before opening.',
        time: '04:45 pm',
        likes: 3,
      },
    ],
  },
  {
    id: '4',
    user: { name: 'Emily Lai', avatar: '👩🏻', tags: ['JobScam', 'Telegram'] },
    time: '12:00 am',
    timestamp: new Date('2024-03-20T00:00:00').getTime(),
    title: 'Job Scam: Part time packing',
    content: "Congratulations, you have completed your registration! Let's start your learning journey next…",
    stats: { likes: 70, comments: 5 },
    comments: [
      {
        id: '1',
        user: { name: 'Sophie Lim', avatar: '👩🏻' },
        content: 'These job scams are getting more sophisticated. Always verify the company.',
        time: '12:05 am',
        likes: 6,
      },
      {
        id: '2',
        user: { name: 'Kevin Tan', avatar: '🧑🏻' },
        content: 'I received a similar message. The company name was slightly different from the real one.',
        time: '12:10 am',
        likes: 4,
      },
      {
        id: '3',
        user: { name: 'Grace Wong', avatar: '👩🏻' },
        content: 'Report these to the police. They have a dedicated team for job scams.',
        time: '12:15 am',
        likes: 8,
      },
      {
        id: '4',
        user: { name: 'Daniel Lee', avatar: '🧑🏻' },
        content: 'Legitimate companies will never ask for payment to start work.',
        time: '12:20 am',
        likes: 5,
      },
      {
        id: '5',
        user: { name: 'Amanda Chen', avatar: '👩🏻' },
        content: "Check the company's registration number on ACRA before proceeding.",
        time: '12:25 am',
        likes: 7,
      },
    ],
  },
];
