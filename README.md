# dev-devops-portfolio-cloud

Personal site for McDonald Musimwa: software developer moving into DevOps. Design B, "Cloud Console": black and sky blue, laid out like a cloud provider's console, with a light mode.

Built with React, TypeScript, Vite and Tailwind CSS v4. The sibling project `dev-devops-portfolio` is design A (IDE / terminal, gold).

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the built site
npm run lint
```

## Where things live

- `src/data/portfolio.ts`: all content (profile, skills, pipeline, projects, jobs, education, blog). Edit this to update the site.
- `src/sections/`: Overview, Terminal (cloud shell), About, Workloads, Deployments, Certificates, Logs, Contact.
- `src/components/`: top bar, sidebar, Ctrl+K command palette, boot loader, headshot, icons.
- `src/index.css`: theme tokens for dark and light.

## Hire-me form (EmailJS)

The contact form in `src/sections/Contact.tsx` sends email through [EmailJS](https://www.emailjs.com), so no backend is needed.

1. Create a free EmailJS account, connect your Gmail under **Email Services**, and create a template under **Email Templates**.
2. Use these variables in the template: `{{from_name}}`, `{{reply_to}}`, `{{company}}`, `{{role}}`, `{{message}}`. Set the template's Reply-To to `{{reply_to}}`.
3. Copy `.env.example` to `.env.local` and fill in the service ID, template ID and public key. Restart `npm run dev`.

Until the keys are set, the form falls back to opening the visitor's mail app with the message filled in.
