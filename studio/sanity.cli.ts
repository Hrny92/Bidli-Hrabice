import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'fxnzotxb',
    dataset: 'production'
  },
  // appId bude vygenerováno při prvním `sanity deploy`
  deployment: {
    autoUpdates: true,
  }
})
