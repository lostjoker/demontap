import { Entrypoint } from '@pm2/io'
import { App } from './src/app/app'
import { Log } from './src/core/Log'

// tslint:disable-next-line:new-parens no-unused-expression
new (class GmudServerNew extends Entrypoint {
    // This is the very first method called on startup
    onStart(cb: () => void) {
        App.run()
            .then(() => {
                console.log('Server running!')
                return cb()
            })
            .catch((e: any) => {
                console.error(e)
                console.log('Server start failed!')
                process.exit(1)
            })
    }

    // This is the very last method called on exit || uncaught exception
    async onStop(err: Error, cb: () => void, code: number, signal: string) {
        if (err) Log.e(err)
        Log.i(`App has exited with code ${code}`)
        await App.app.close()
        return cb()
    }
})()
