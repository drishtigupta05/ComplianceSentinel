export const PURPOSES = [
  {
    key: 'essential',
    label: 'Essential Account Services',
    description:
      'Processing your personal data is necessary to operate and maintain your account, authenticate your identity, process transactions, and provide the core services you have enrolled in.',
    legalBasis: 'Contractual Necessity & Legitimate Interest (DPDPA §7(a))',
    dataCollected: ['Full Name', 'Email Address', 'Phone Number', 'Account Credentials', 'Transaction Records'],
    withdrawEffect: null,
    mandatory: true,
    icon: 'Shield',
    regulatoryNote: 'This processing is required by the RBI Master Direction on KYC (2016) and cannot be disabled.',
  },
  {
    key: 'marketing',
    label: 'Marketing Communications',
    description:
      'Sending you promotional offers, product updates, personalised recommendations, and marketing content via your preferred communication channel.',
    legalBasis: 'Consent (DPDPA §6)',
    dataCollected: ['Email Address', 'Phone Number', 'Browsing History', 'Purchase History', 'Interaction Logs'],
    withdrawEffect:
      'You will no longer receive marketing communications. Transactional, regulatory, and service notifications will continue unaffected.',
    mandatory: false,
    icon: 'Mail',
    regulatoryNote: null,
  },
  {
    key: 'partner_sharing',
    label: 'Data Sharing with Partners',
    description:
      'Sharing anonymised or pseudonymised data with approved third-party partners for joint service delivery, co-lending arrangements, and aggregated analytics under data processing agreements.',
    legalBasis: 'Consent (DPDPA §6)',
    dataCollected: ['Usage Patterns', 'Demographic Data', 'Transaction Summaries', 'Credit Score Tier'],
    withdrawEffect:
      'Your data will no longer be shared with third-party partners. Existing shared data will be flagged for deletion per partner data processing agreements within 30 days.',
    mandatory: false,
    icon: 'Share2',
    regulatoryNote: null,
  },
  {
    key: 'analytics',
    label: 'Product Analytics',
    description:
      'Collecting anonymised and pseudonymised usage data to improve platform performance, enhance user experience, identify bugs, and inform product development roadmaps.',
    legalBasis: 'Consent (DPDPA §6)',
    dataCollected: ['Navigation Logs', 'Feature Usage Events', 'Device Type', 'Session Duration', 'Error Logs'],
    withdrawEffect:
      'Analytics tracking will be disabled on your account. Some personalisation features may be limited as a result.',
    mandatory: false,
    icon: 'BarChart2',
    regulatoryNote: null,
  },
  {
    key: 'credit_reporting',
    label: 'Credit Bureau Reporting',
    description:
      'Sharing your financial behaviour data with authorised credit information companies (CICs) — including CIBIL, Experian, CRIF, and Equifax — as required by RBI guidelines for credit assessment and systemic risk monitoring.',
    legalBasis: 'Regulatory Obligation & Consent (RBI Master Direction 2016, DPDPA §8(2))',
    dataCollected: ['Payment History', 'Credit Utilisation', 'Account Standing', 'Default Records', 'Repayment Track Record'],
    withdrawEffect:
      'Credit bureau reporting will be paused for voluntary data submissions. Mandatory regulatory reporting under RBI directions may still occur independent of this consent.',
    mandatory: false,
    icon: 'CreditCard',
    regulatoryNote:
      'Note: Certain credit bureau submissions are mandatory under RBI directions regardless of consent status.',
  },
]
