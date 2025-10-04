# subbot

A powerful Telegram bot built with TypeScript and Telegraf that automates subscription management, renewals, and group moderation. It integrates Telegram’s native payment system, runs scheduled tasks with cron, and uses AI to detect spam, scams, and toxic messages in groups.

## Features

- 💳 **Subscription System** – Handles new subscriptions using Telegram’s native payment features.
- 🔁 **Renewal & Cron Jobs** – Automatically checks expiring subscriptions and sends renewal invoices.
- 🧠 **AI Message Moderation** – Flags spam, scams, and offensive messages using OpenAI/OpenRouter models.
- 👥 **Group Access Control** – Grants and removes access to Telegram groups based on subscription status.
- 🧾 **Invoice Management** – Sends new and renewal invoices, and tracks subscription states.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Telegraf
- **Database:** MongoDB
- **AI:** OpenRouter / OpenAI
- **Scheduler:** Node Cron

## Getting Started

### Prerequisites

- Node.js (>= 18)
- MongoDB
- Telegram Bot Token
- OpenRouter or OpenAI API Key

### Installation

```bash
git clone https://github.com/yourusername/subbot.git
cd subbot
pnpm install
```

Create a `.env` file and set the following variables:

```
PORT=your_port
MONGODB_URI=your_mongodb_uri
BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openrouter_or_openai_key
CHAPA_PROVIDER_TOKEN=token_provided_by_bot_father_for_telegram_payments
```

### Run the Bot

Development:

```bash
pnpm run dev
```

Production (with PM2):

```bash
pnpm run build
pm2 start ecosystem.config.js
```

## Folder Structure

```
subbot/
├── ecosystem.config.js
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│   ├── bot
│   │   ├── commands.ts  # Commands
│   │   ├── handlers # Bot handlers
│   │   │   ├── ai.handler.ts
│   │   │   ├── message.handler.ts
│   │   │   └── payment.handler.ts
│   │   └── index.ts
│   ├── Bot.ts    # Bot Entry Point
│   ├── config
│   │   ├── db.ts
│   │   └── index.ts
│   ├── cron         # Scheduled tasks for renewals and expiries
│   │   └── subscription.cron.ts
│   ├── models
│   │   ├── groups.model.ts
│   │   ├── subscription.model.ts
│   │   └── user.model.ts
│   ├── Server.ts
│   ├── services        # AI, invoice,subscription etc.. logic
│   │   ├── ai.service.ts
│   │   ├── groups.service.ts
│   │   ├── payment.service.ts
│   │   ├── subscription.service.ts
│   │   └── user.service.ts
│   └── types # Shared Types
│       └── subscription.type.ts
└── tsconfig.json

```

## License

MIT License.
