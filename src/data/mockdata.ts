export const automations = [
  {
    id: '1',
    name: 'WhatsApp Customer Support',
    description: 'Automated responses for common customer inquiries via WhatsApp',
    status: 'enabled' as const,
    type: 'whatsapp' as const,
    lastRun: {
      time: '2 hours ago',
      status: 'success' as const,
    },
    tags: [
      { label: 'whatsapp', variant: 'green' as const },
      { label: 'customer-support', variant: 'blue' as const },
    ],
    runCount: 1243,
    createdAt: '2026-05-15',
    logs: [
      { timestamp: '2026-06-20 10:23:45', status: 'success' as const, message: 'Automation executed successfully' },
      { timestamp: '2026-06-20 08:15:32', status: 'success' as const, message: 'Automation executed successfully' },
      { timestamp: '2026-06-20 06:42:18', status: 'failed' as const, message: 'API rate limit exceeded' },
      { timestamp: '2026-06-19 22:11:05', status: 'success' as const, message: 'Automation executed successfully' },
      { timestamp: '2026-06-19 20:33:21', status: 'success' as const, message: 'Automation executed successfully' },
    ],
  },
  {
    id: '2',
    name: 'Daily Report Generator',
    description: 'Generate and send daily analytics reports to team members',
    status: 'enabled' as const,
    type: 'cron' as const,
    lastRun: {
      time: '5 hours ago',
      status: 'success' as const,
    },
    tags: [
      { label: 'cron', variant: 'blue' as const },
      { label: 'reporting', variant: 'purple' as const },
    ],
    runCount: 156,
    createdAt: '2026-04-10',
    logs: [
      { timestamp: '2026-06-20 05:00:00', status: 'success' as const, message: 'Daily report sent successfully' },
      { timestamp: '2026-06-19 05:00:00', status: 'success' as const, message: 'Daily report sent successfully' },
      { timestamp: '2026-06-18 05:00:00', status: 'success' as const, message: 'Daily report sent successfully' },
    ],
  },
  {
    id: '3',
    name: 'Lead Qualification Workflow',
    description: 'Automatically score and route new leads based on criteria',
    status: 'enabled' as const,
    type: 'n8n' as const,
    lastRun: {
      time: '30 minutes ago',
      status: 'success' as const,
    },
    tags: [
      { label: 'n8n', variant: 'purple' as const },
      { label: 'sales', variant: 'green' as const },
    ],
    runCount: 892,
    createdAt: '2026-03-22',
    logs: [
      { timestamp: '2026-06-20 11:45:12', status: 'success' as const, message: 'Lead processed and routed' },
      { timestamp: '2026-06-20 11:12:33', status: 'success' as const, message: 'Lead processed and routed' },
      { timestamp: '2026-06-20 10:58:41', status: 'success' as const, message: 'Lead processed and routed' },
    ],
  },
  {
    id: '4',
    name: 'Slack Notification Bot',
    description: 'Send real-time alerts to Slack channels for important events',
    status: 'disabled' as const,
    type: 'n8n' as const,
    lastRun: {
      time: '2 days ago',
      status: 'failed' as const,
    },
    tags: [
      { label: 'n8n', variant: 'purple' as const },
      { label: 'notifications', variant: 'default' as const },
    ],
    runCount: 445,
    createdAt: '2026-02-08',
    logs: [
      { timestamp: '2026-06-18 14:22:11', status: 'failed' as const, message: 'Slack API authentication failed' },
      { timestamp: '2026-06-18 10:15:33', status: 'success' as const, message: 'Notification sent successfully' },
    ],
  },
  {
    id: '5',
    name: 'Database Backup Scheduler',
    description: 'Automated daily backups of production database',
    status: 'enabled' as const,
    type: 'cron' as const,
    lastRun: {
      time: '18 hours ago',
      status: 'success' as const,
    },
    tags: [
      { label: 'cron', variant: 'blue' as const },
      { label: 'backup', variant: 'default' as const },
      { label: 'critical', variant: 'purple' as const },
    ],
    runCount: 234,
    createdAt: '2026-01-12',
    logs: [
      { timestamp: '2026-06-20 02:00:00', status: 'success' as const, message: 'Backup completed: 2.3 GB' },
      { timestamp: '2026-06-19 02:00:00', status: 'success' as const, message: 'Backup completed: 2.2 GB' },
      { timestamp: '2026-06-18 02:00:00', status: 'success' as const, message: 'Backup completed: 2.2 GB' },
    ],
  },
  {
    id: '6',
    name: 'Order Confirmation WhatsApp',
    description: 'Send order confirmations and tracking info via WhatsApp',
    status: 'enabled' as const,
    type: 'whatsapp' as const,
    lastRun: {
      time: '15 minutes ago',
      status: 'success' as const,
    },
    tags: [
      { label: 'whatsapp', variant: 'green' as const },
      { label: 'e-commerce', variant: 'blue' as const },
    ],
    runCount: 2156,
    createdAt: '2026-03-01',
    logs: [
      { timestamp: '2026-06-20 12:00:22', status: 'success' as const, message: 'Order confirmation sent' },
      { timestamp: '2026-06-20 11:45:15', status: 'success' as const, message: 'Order confirmation sent' },
      { timestamp: '2026-06-20 11:30:08', status: 'success' as const, message: 'Order confirmation sent' },
    ],
  },
];

export const kpiData = {
  totalAutomations: automations.length,
  enabledAutomations: automations.filter(a => a.status === 'enabled').length,
  runs24h: 47,
  failedRuns: 3,
};
