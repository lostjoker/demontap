import 'source-map-support/register'
import { App } from './src/app/app'

declare const module:
    | {
          hot: {
              accept: () => void
              dispose: (func: () => void) => void
          }
      }
    | undefined

App.run()
    .then(() => {
        console.log('Server running!')

        if (typeof module !== 'undefined' && module.hot) {
            module.hot.accept()
            module.hot.dispose(() => App.app.close())
        }

        if (typeof process.send === 'function') {
            process.send('ready')
        }
    })
    .catch((e: any) => {
        console.error(e)
        console.log('Server start failed!')
        process.exit(1)
    })
