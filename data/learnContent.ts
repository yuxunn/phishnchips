export type LessonPart = {
  id: string;
  title: string;
  duration: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  description?: string;
  content: {
    sections: {
      title: string;
      content: string;
      image?: any;
    }[];
  };
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  image: any;
  popular: boolean;
  description: string;
  saved: boolean;
  parts: LessonPart[];
};

export const lessons: Lesson[] = [
  {
    id: 'lesson01',
    title: 'Phishing & Social Engineering',
    duration: '16 mins',
    image: require('@/assets/images/badge03.png'),
    popular: true,
    description: 'Learn about common phishing techniques and social engineering tactics used by scammers to trick people into revealing sensitive information.',
    saved: false,
    parts: [
      {
        id: 'part01',
        title: 'What is phishing?',
        duration: '1:05',
        isUnlocked: true,
        isCompleted: true,
        description: 'Understand the basics of phishing attacks, how they work, and why they are so effective. Learn to recognize common phishing attempts.',
        content: {
          sections: [
            {
              title: 'Introduction to Phishing',
              content: 'Phishing is a type of cyber attack where attackers impersonate legitimate organizations to trick individuals into revealing sensitive information such as passwords, credit card numbers, or personal data. The term "phishing" is a play on the word "fishing" - attackers are "fishing" for sensitive information.',
            },
            {
              title: 'How Phishing Works',
              content: 'Phishing attacks typically follow these steps:\n\n1. The attacker creates a fake website or email that looks legitimate\n2. They send messages to potential victims\n3. The message creates a sense of urgency or fear\n4. Victims are tricked into clicking links or providing information\n5. The attacker collects the sensitive information',
            },
            {
              title: 'Common Phishing Techniques',
              content: 'Here are some common phishing techniques to watch out for:\n\n• Email Phishing: Fake emails pretending to be from legitimate companies\n• Spear Phishing: Targeted attacks on specific individuals or organizations\n• Whaling: Attacks targeting high-profile individuals like CEOs\n• Smishing: Phishing attacks via SMS messages\n• Vishing: Phishing attacks via voice calls',
            },
            {
              title: 'Real-World Example',
              content: 'A common phishing email might look like this:\n\n"Dear valued customer,\n\nWe noticed unusual activity on your account. To protect your account, please click the link below to verify your information.\n\n[Click here to verify]\n\nIf you don\'t take action within 24 hours, your account will be suspended."\n\nThis creates urgency and fear to make you act quickly without thinking.',
            }
          ]
        }
      },
      {
        id: 'part02',
        title: 'What is social engineering?',
        duration: '2:10',
        isUnlocked: true,
        isCompleted: false,
        description: 'Explore the psychological manipulation techniques used by scammers to trick people into making security mistakes or giving away sensitive information.',
        content: {
          sections: [
            {
              title: 'Understanding Social Engineering',
              content: 'Social engineering is the art of manipulating people into performing actions or divulging confidential information. Unlike traditional hacking, social engineering relies on human interaction and often involves tricking people into breaking normal security procedures.',
            },
            {
              title: 'The Psychology Behind Social Engineering',
              content: 'Social engineers exploit several psychological principles:\n\n• Authority: People tend to comply with requests from authority figures\n• Urgency: Creating a sense of urgency reduces critical thinking\n• Reciprocity: People feel obliged to return favors\n• Social Proof: People tend to follow what others are doing\n• Scarcity: Limited-time offers create a sense of urgency',
            },
            {
              title: 'Common Social Engineering Tactics',
              content: 'Here are some tactics social engineers use:\n\n1. Pretexting: Creating a fake scenario to obtain information\n2. Baiting: Offering something enticing to get information\n3. Quid Pro Quo: Offering a service in exchange for information\n4. Tailgating: Following someone into a restricted area\n5. Phishing: Using fake communications to get information',
            },
            {
              title: 'Protecting Yourself',
              content: 'To protect yourself from social engineering:\n\n• Be skeptical of unsolicited communications\n• Verify the identity of the person or organization\n• Don\'t share sensitive information over email or phone\n• Use strong passwords and two-factor authentication\n• Keep your software and systems updated\n• Report suspicious activities to your IT department',
            }
          ]
        }
      },
      {
        id: 'part03',
        title: 'Case study 1',
        duration: '5:48',
        isUnlocked: false,
        isCompleted: false,
        description: 'Analyze a real-world phishing attack case study to understand how scammers operate and how to protect yourself from similar attempts.',
        content: {
          sections: [
            {
              title: 'The Target: A Medium-Sized Company',
              content: 'In 2023, a medium-sized company fell victim to a sophisticated phishing attack. The attackers targeted the company\'s finance department, specifically employees responsible for processing payments.',
            },
            {
              title: 'The Attack Method',
              content: 'The attack unfolded in several stages:\n\n1. The attackers spent weeks researching the company\n2. They identified key employees on LinkedIn\n3. Created fake email accounts mimicking the CEO\n4. Sent urgent payment requests to the finance team\n5. Used psychological pressure to bypass security checks',
            },
            {
              title: 'The Impact',
              content: 'The consequences were severe:\n\n• $50,000 was transferred to the attacker\'s account\n• Company operations were disrupted for days\n• Customer data was compromised\n• Reputation damage\n• Legal and regulatory issues',
            },
            {
              title: 'Lessons Learned',
              content: 'This case study teaches us several important lessons:\n\n1. Always verify payment requests through multiple channels\n2. Implement strict approval processes for large transactions\n3. Regular security training is essential\n4. Have an incident response plan ready\n5. Use technology to detect and prevent phishing attempts',
            },
            {
              title: 'Preventive Measures',
              content: 'To prevent similar attacks:\n\n• Implement multi-factor authentication\n• Use email authentication protocols (SPF, DKIM, DMARC)\n• Regular security awareness training\n• Strict payment approval processes\n• Regular security audits and penetration testing',
            }
          ]
        }
      }
    ]
  },
  {
    id: 'lesson02',
    title: 'Detecting Scams 101',
    duration: '8 mins',
    image: require('@/assets/images/badge02.png'),
    popular: false,
    description: 'Learn how to detect scams with practical examples and real-world scenarios.',
    saved: false,
    parts: [
      {
        id: 'part01',
        title: 'Recognizing scam patterns',
        duration: '2:00',
        isUnlocked: true,
        isCompleted: false,
        description: 'Learn to identify common patterns and red flags in scam attempts, including suspicious URLs, urgent requests, and too-good-to-be-true offers.',
        content: {
          sections: [
            {
              title: 'Common Scam Patterns',
              content: 'Scammers often use similar patterns across different types of scams. Here are the most common ones:\n\n1. Urgency and Pressure\n2. Too Good to Be True Offers\n3. Requests for Personal Information\n4. Unusual Payment Methods\n5. Poor Grammar and Spelling',
            },
            {
              title: 'Red Flags to Watch For',
              content: 'These warning signs should make you suspicious:\n\n• Requests for immediate action\n• Demands for personal or financial information\n• Offers that seem too good to be true\n• Pressure to keep the communication secret\n• Requests to bypass normal procedures',
            },
            {
              title: 'Suspicious Communication Patterns',
              content: 'Watch out for these communication patterns:\n\n• Generic greetings ("Dear User" instead of your name)\n• Poor grammar and spelling\n• Inconsistent email addresses\n• Requests to click on links or download attachments\n• Pressure to act quickly',
            },
            {
              title: 'Verification Steps',
              content: 'When you encounter a suspicious situation:\n\n1. Take a step back and don\'t act immediately\n2. Verify the source through official channels\n3. Check for spelling and grammar errors\n4. Look for inconsistencies in the communication\n5. Consult with colleagues or security experts',
            }
          ]
        }
      },
      {
        id: 'part02',
        title: 'Reporting scams',
        duration: '3:00',
        isUnlocked: false,
        isCompleted: false,
        description: 'Discover the proper channels and procedures for reporting scams to help protect others and contribute to scam prevention efforts.',
        content: {
          sections: [
            {
              title: 'Why Report Scams?',
              content: 'Reporting scams is crucial because:\n\n• It helps authorities track and prevent scams\n• Protects others from falling victim\n• Contributes to scam prevention efforts\n• Helps identify new scam patterns\n• Supports law enforcement investigations',
            },
            {
              title: 'Where to Report',
              content: 'Different types of scams should be reported to different authorities:\n\n• Police: For financial scams and fraud\n• Cyber Security Agency: For online scams\n• Bank: For banking-related scams\n• Platform: For scams on social media or websites\n• Consumer Protection Agency: For consumer scams',
            },
            {
              title: 'What Information to Include',
              content: 'When reporting a scam, include:\n\n1. Date and time of the incident\n2. Method of contact (email, phone, etc.)\n3. Scammer\'s contact information\n4. Any money or information lost\n5. Screenshots or evidence\n6. Your contact information',
            },
            {
              title: 'After Reporting',
              content: 'After reporting a scam:\n\n• Keep all evidence and documentation\n• Monitor your accounts for suspicious activity\n• Update your security measures\n• Share your experience to help others\n• Stay informed about new scam patterns',
            }
          ]
        }
      }
    ]
  },
  {
    id: 'lesson03',
    title: 'Privacy and Data Protection',
    duration: '13 mins',
    image: require('@/assets/images/badge01.png'),
    popular: true,
    description: 'Protect your privacy and data online with these essential tips and best practices.',
    saved: false,
    parts: [
      {
        id: 'part01',
        title: 'Understanding privacy',
        duration: '3:00',
        isUnlocked: true,
        isCompleted: false,
        description: 'Learn about digital privacy, why it matters, and how your personal information can be used or misused online.',
        content: {
          sections: [
            {
              title: 'What is Digital Privacy?',
              content: 'Digital privacy refers to the protection of your personal information in the digital world. It encompasses:\n\n• Personal data protection\n• Online behavior privacy\n• Communication privacy\n• Information sharing control\n• Digital footprint management',
            },
            {
              title: 'Why Privacy Matters',
              content: 'Privacy is important because:\n\n1. Protects your personal information\n2. Prevents identity theft\n3. Maintains your reputation\n4. Gives you control over your data\n5. Protects your financial security',
            },
            {
              title: 'Common Privacy Risks',
              content: 'Be aware of these privacy risks:\n\n• Data breaches\n• Identity theft\n• Online tracking\n• Social media exposure\n• Unauthorized data sharing\n• Location tracking',
            },
            {
              title: 'Privacy Best Practices',
              content: 'To protect your privacy:\n\n• Use strong, unique passwords\n• Enable two-factor authentication\n• Review privacy settings regularly\n• Be careful what you share online\n• Use privacy-focused tools and services\n• Keep software updated',
            }
          ]
        }
      },
      {
        id: 'part02',
        title: 'Data protection basics',
        duration: '4:00',
        isUnlocked: false,
        isCompleted: false,
        description: 'Master the fundamental practices for protecting your personal data, including strong passwords, two-factor authentication, and secure browsing habits.',
        content: {
          sections: [
            {
              title: 'Strong Password Creation',
              content: 'Creating strong passwords is essential:\n\n• Use at least 12 characters\n• Include uppercase and lowercase letters\n• Add numbers and special characters\n• Avoid common words and patterns\n• Use unique passwords for each account',
            },
            {
              title: 'Two-Factor Authentication',
              content: 'Two-factor authentication adds an extra layer of security:\n\n1. Something you know (password)\n2. Something you have (phone or security key)\n3. Something you are (biometric data)\n\nThis makes it much harder for attackers to access your accounts.',
            },
            {
              title: 'Secure Browsing Habits',
              content: 'Practice these secure browsing habits:\n\n• Use HTTPS websites\n• Avoid public Wi-Fi for sensitive tasks\n• Clear browser data regularly\n• Use private browsing when needed\n• Be careful with downloads\n• Keep browsers updated',
            },
            {
              title: 'Data Backup and Recovery',
              content: 'Protect your data with proper backup:\n\n1. Regular backups of important data\n2. Multiple backup locations\n3. Encrypted backups\n4. Test recovery procedures\n5. Keep backup devices secure',
            }
          ]
        }
      }
    ]
  }
]; 