/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_RESOURCES, 
  INITIAL_FINDINGS, 
  INITIAL_DRIFTS 
} from './src/data/mockCloudData.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side State Engine
let cloudAccounts = [...INITIAL_ACCOUNTS];
let cloudResources = [...INITIAL_RESOURCES];
let findings = [...INITIAL_FINDINGS];
let drifts = [...INITIAL_DRIFTS];
let systemNotifications: {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}[] = [
  {
    id: 'n-1',
    title: 'Initial Multi-Cloud Scans Finished',
    message: 'Scanned 14 resources across AWS DevStack and GCP ProdScale. 8 findings discovered.',
    type: 'info' as const,
    timestamp: '2026-06-11 07:45 UTC',
    read: false
  },
  {
    id: 'n-2',
    title: 'Critical Vulnerability Detected',
    message: 'Public financial receipt bucket found in GCP ProdScale. Restrict allUsers anonymous access immediately.',
    type: 'error' as const,
    timestamp: '2026-06-11 07:44 UTC',
    read: false
  }
];

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

/* ==========================================================================
   REST API CONTRACTS
   ========================================================================== */

// 1. Connection Configurations & Account setup
app.get('/api/accounts', (req, res) => {
  res.json({ success: true, data: cloudAccounts });
});

app.post('/api/accounts/connect', (req, res) => {
  const { provider, name, region, arnRole, externalId, serviceAccountJson, serviceAccountEmail } = req.body;
  
  if (!provider || !name) {
    res.status(400).json({ success: false, error: 'Provider and Name of account are required.' });
    return;
  }

  const newAccount = {
    id: `acc-${provider.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    provider: provider as 'AWS' | 'GCP',
    status: 'connected' as const,
    arnRole,
    externalId,
    serviceAccountEmail: serviceAccountEmail || (serviceAccountJson ? JSON.parse(serviceAccountJson).client_email : undefined),
    lastScanned: 'Just Connected',
    region: region || (provider === 'AWS' ? 'us-east-1' : 'us-central1'),
    resourcesCount: 0
  };

  cloudAccounts.push(newAccount);

  // Auto-inject a few resources for the newly registered account to make the dashboard alive
  const sampleResources = [
    {
      id: `${provider.toLowerCase()}-vm-${Math.random().toString(36).substr(2, 9)}`,
      accountId: newAccount.id,
      name: `${name.toLowerCase().replace(/\s+/g, '-')}-worker-node-1`,
      type: 'virtual_machine' as const,
      provider: provider as 'AWS' | 'GCP',
      region: newAccount.region,
      status: 'active' as const,
      costMonthly: 45,
      tags: { Environment: 'Sandbox', Service: 'Worker' },
      details: { instanceType: provider === 'AWS' ? 't3.medium' : 'e2-medium', isUnused: false }
    },
    {
      id: `${provider.toLowerCase()}-bucket-${Math.random().toString(36).substr(2, 9)}`,
      accountId: newAccount.id,
      name: `${name.toLowerCase().replace(/\s+/g, '-')}-public-raw-media`,
      type: 'storage_bucket' as const,
      provider: provider as 'AWS' | 'GCP',
      region: newAccount.region,
      status: 'warning' as const,
      costMonthly: 12,
      tags: { Environment: 'Sandbox' },
      details: { sizeGb: 250, encryptionEnabled: false }
    }
  ];

  cloudResources.push(...sampleResources);
  newAccount.resourcesCount = sampleResources.length;

  res.json({ success: true, data: newAccount });
});

// Delete account connection
app.delete('/api/accounts/:id', (req, res) => {
  const { id } = req.params;
  cloudAccounts = cloudAccounts.filter(acc => acc.id !== id);
  cloudResources = cloudResources.filter(res => res.accountId !== id);
  findings = findings.filter(f => f.accountId !== id);
  drifts = drifts.filter(d => d.accountId !== id);
  res.json({ success: true, message: 'Account context disconnected successfully.' });
});

// Trigger discovery scan
app.post('/api/accounts/scan/:id', (req, res) => {
  const { id } = req.params;
  const targetAcc = cloudAccounts.find(acc => acc.id === id);
  
  if (!targetAcc) {
    res.status(404).json({ success: false, error: 'Account not found.' });
    return;
  }

  // Update scanner timestamp
  targetAcc.status = 'connected';
  const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 16) + ' UTC';
  targetAcc.lastScanned = nowStr;

  // Add scan completed systems alerts
  const newNotification = {
    id: `n-${Date.now()}`,
    title: `Scan Completed for ${targetAcc.name}`,
    message: `Scanned all active services in region ${targetAcc.region}. 0 new vulnerabilities found.`,
    type: 'success' as const,
    timestamp: nowStr,
    read: false
  };
  systemNotifications.unshift(newNotification);

  res.json({ success: true, message: `Completed cloud scanning for ${targetAcc.name}.` });
});

// 2. Resource catalog
app.get('/api/resources', (req, res) => {
  res.json({ success: true, data: cloudResources });
});

// 3. Security vulnerabilities and cost advice findings
app.get('/api/findings', (req, res) => {
  res.json({ success: true, data: findings });
});

// Fix a security finding dynamically (simulate remediation)
app.post('/api/findings/resolve/:id', (req, res) => {
  const { id } = req.params;
  const targetFinding = findings.find(f => f.id === id);
  
  if (!targetFinding) {
    res.status(404).json({ success: false, error: 'Finding not found.' });
    return;
  }

  targetFinding.status = 'resolved';

  // Fix the corresponding resource state too to show real interactive outcome
  const matchingRes = cloudResources.find(r => r.id === targetFinding.resourceId);
  if (matchingRes) {
    matchingRes.status = 'active';
    if (matchingRes.type === 'storage_bucket') {
      matchingRes.details.encryptionEnabled = true;
    }
  }

  res.json({ success: true, data: targetFinding });
});

// 4. Drift status
app.get('/api/drift', (req, res) => {
  res.json({ success: true, data: drifts });
});

app.post('/api/drift/resolve/:id', (req, res) => {
  const { id } = req.params;
  const targetDrift = drifts.find(d => d.id === id);
  if (targetDrift) {
    drifts = drifts.filter(d => d.id !== id);
  }
  res.json({ success: true, message: 'Drift resolved by synchronizing configuration.' });
});

// 5. System alerts
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: systemNotifications });
});

app.post('/api/notifications/clear', (req, res) => {
  systemNotifications = [];
  res.json({ success: true });
});

/// 6. AI Advisor retrieval-augmented chat Proxy
app.post('/api/advisor/chat', async (req, res) => {
  const { prompt, chatHistory = [], isBeginnerMode = false } = req.body;

  if (!prompt) {
    res.status(400).json({ success: false, error: 'A user prompt or script inquiry is required.' });
    return;
  }

  const ai = getGeminiClient();

  // Dense local serialized multi-cloud data for RAG context
  const activeResourcesText = cloudResources.map(r => 
    `- [${r.provider}] ID: ${r.id}, Name: ${r.name}, Type: ${r.type}, Region: ${r.region}, Status: ${r.status}, MonthlyCost: $${r.costMonthly}, Tags: ${JSON.stringify(r.tags)}, Configs: ${JSON.stringify(r.details)}`
  ).join('\n');

  const activeFindingsText = findings.filter(f => f.status === 'active').map(f => 
    `- [${f.severity.toUpperCase()}] Category: ${f.category}, Resource: ${f.resourceName} (${f.resourceId}), Title: ${f.title}. Details: ${f.description}`
  ).join('\n');

  const activeDriftsText = drifts.map(d =>
    `- Resource: ${d.resourceName} (${d.resourceType}) experienced drift. State has [${d.stateValue}] while active Cloud has [${d.actualValue}]. Suggestion: ${d.suggestedFix}`
  ).join('\n');

  const modeInstruction = isBeginnerMode
    ? `The user is in BEGINNER MODE. You must act as an extremely patient, friendly, and nurturing Senior Cloud Mentor. Explain all cloud terminologies or finding issues using plain English and clear everyday analogies FIRST before introducing any technical code (e.g., compared firewall ports to lock doors, explain IAM as restricted guest badges). Avoid heavy unneeded jargon, outline the concepts simply, and keep a welcoming, education-focused, and resume-building tone.`
    : `The user is in PROFESSIONAL MODE. You must act as a high-fidelity Principal Cloud Architect & Security Guru. Be direct, authoritative, highly technical, and brief. Dive straight into physical resource configurations, specific HCL Terraform code blocks, advanced security postures, and specific AWS CLI / gcloud parameters. Ensure you cite real resources from the active logs.`;

  const systemInstruction = `You are CloudGuardian AI, an industry-leading Principal Multi-Cloud Infrastructure Security, Cost, and IaC Architect.
You help engineers and DevOps teams analyze, secure, and optimize their multi-cloud environments.

${modeInstruction}

Here is the real-time Retrieval-Augmented Context from our active CloudGuardian scan discovery logs:

=== CURRENT SCAN STATS ===
- Connected Accounts: ${cloudAccounts.length}
- Total Cloud Assets: ${cloudResources.length}
- Active critical issues: ${findings.filter(f => f.severity === 'critical' && f.status === 'active').length}
- Monthly Infrastructure Expense: $${cloudResources.reduce((sum, r) => sum + r.costMonthly, 0)}

=== ACTIVE CATALOGED ASSETS ===
${activeResourcesText}

=== SEVERE UNRESOLVED FINDINGS ===
${activeFindingsText}

=== TERRAFORM CONFIGURATION DRIFT ===
${activeDriftsText}

=== INSTRUCTIONS ===
1. Analyze finding risks, specify explicit remediation steps with real AWS CLI, gcloud, or Terraform block configurations.
2. Be direct, authoritative, professional, and helpful. Prefer listing clear numbered solutions.
3. Keep answers visually beautiful using standard markdown. Use spacing and bullet points.
4. Do not offer simulated generalities; reference actual resources from the context above (e.g., mention raw names like 'guardian-untrusted-static-assets' or key groups 'kubernetes-worker-security-group').`;

  if (!ai) {
    // Elegant explanation that API key was not supplied, while generating a beautiful, highly useful smart fallback response
    const beginnerText = `**Notice**: CloudGuardian AI advisor is running in *Mentor Sandbox Mode* because no \`GEMINI_API_KEY\` was parsed from your environment variables. 
    
But don't worry! I'll act as your senior cloud computing mentor and walk you through these issues step-by-step:

### 🌟 What is happening here?
Your cloud has open "firewall doors" and public folders. Let's look at them like a normal house:

1. **The Front Door is Unlocked (\`kubernetes-worker-security-group\`)**:
   - **What it is**: A security group (firewall) is a perimeter wall around your virtual computer. Currently, port 22 (SSH door) is wide open to **everyone on Earth** (\`0.0.0.0/0\`). This means automated scanners can try to guess your logins.
   - **What to do**: Lock this down so only your secure home or office network can get in. Run this simple recipe:
     \`\`\`bash
     aws ec2 revoke-security-group-ingress \\
       --group-id sg-0219ad3a7ef0129a \\
       --protocol tcp \\
       --port 22 \\
       --cidr 0.0.0.0/0
     \`\`\`

2. **The Filing Cabinet is Public (\`gcp-sensitive-customer-receipts\`)**:
   - **What it is**: Your storage bucket is like an online filing cabinet. You have granted permission to **allUsers** (the whole internet) to view private files.
   - **What to do**: Toggle the lock on GCP so everything becomes private again:
     \`\`\`bash
     gcloud storage buckets update gs://gcp-sensitive-customer-receipts --no-public-access-prevention
     \`\`\`

### 💸 Saving Pocket Money
- **Unused Servers**: We found a server \`dev-api-gateway-node-01\` that you are paying **$120/mo** for, but it sits idle 98% of the time! Like leaving a room's heater on high while you are away on vacation. Slowing or stopping it down will save you a bundle!

Would you like to learn more about how to secure S3 bucket policies or add your \`GEMINI_API_KEY\` to explore deeper AI-powered recommendations?`;

    const proText = `**Notice**: CloudGuardian AI advisor is running in *Sandbox Preview Mode* because no \`GEMINI_API_KEY\` was parsed from your environment variables. 

### 🚨 Critical Vulnerability Resolution
1. **AWS Global Security group open SSH port 22 (\`${cloudResources.find(r => r.id === 'sg-0219ad3a7ef0129a')?.name}\`)**:
   Run this AWS CLI command to revoke the globally open ingress SSH traffic:
   \`\`\`bash
   aws ec2 revoke-security-group-ingress \\
     --group-id sg-0219ad3a7ef0129a \\
     --protocol tcp \\
     --port 22 \\
     --cidr 0.0.0.0/0
   \`\`\`
2. **Exposed Public GCP Storage bucket (\`gcp-sensitive-customer-receipts\`)**:
   Disable public permissions on cloud storage instantly via \`gcloud\`:
   \`\`\`bash
   gcloud storage buckets update gs://gcp-sensitive-customer-receipts --no-public-access-prevention
   \`\`\`

### 💸 Cost Optimization Breakdown
- **Unused t3.xlarge instance (\`dev-api-gateway-node-01\`)**:
  This VM is idling with <2% CPU. Stopping this instantly yields **$120/mo savings**.
- **Orphaned database clone Replica (\`guardian-rds-replica-01\`)**:
  No connections detected in 30 days. Stopping this yields **$150/mo savings**.

Would you like to setup your \`GEMINI_API_KEY\` in **Settings > Secrets** to enable live real-time deep-reasoning recommendations?`;
    
    res.json({ success: true, text: isBeginnerMode ? beginnerText : proText });
    return;
  }

  try {
    // Format past conversations into standard parts/messages
    const messages = chatHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current message
    messages.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: messages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: `Gemini API execution failed: ${error.message}. Please verify your API Key.` 
    });
  }
});


/* ==========================================================================
   VITE & STATIC MIDDLEWARE SETUP
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CloudGuardian AI Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
