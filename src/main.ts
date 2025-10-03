import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import '@mdi/font/css/materialdesignicons.css'

// Components
import App from './App.vue'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: { defaultTheme: 'system' },
})

createApp(App).use(vuetify).mount('#app')
