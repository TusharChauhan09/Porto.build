// template.ts
import { Template, waitForURL } from 'e2b';

export const template = Template()
  .fromNodeImage('22-slim')
  .setWorkdir('/home/user/nextjs-16.1.6-app')
  .runCmd(
    'npx create-next-app@16.1.6 . --yes --use-npm'
  )
  .runCmd('npx shadcn@latest init -d')
  .runCmd('npx shadcn@latest add --all --overwrite || true')
  .runCmd(
    'mv /home/user/nextjs-16.1.6-app/* /home/user/nextjs-16.1.6-app/.* /home/user/ 2>/dev/null; rm -rf /home/user/nextjs-16.1.6-app'
  )
  .setWorkdir('/home/user')
  .setStartCmd('npx next dev --turbopack', waitForURL('http://localhost:3000'))