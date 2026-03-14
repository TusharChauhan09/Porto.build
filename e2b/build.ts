// build.ts
import 'dotenv/config';
import { Template, defaultBuildLogger } from 'e2b'
import { template as nextJSTemplate } from './template'

Template.build(nextJSTemplate, 'nextjs-16-1-6-app', {
  cpuCount: 4,
  memoryMB: 4096,
  onBuildLogs: defaultBuildLogger(),
})