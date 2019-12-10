import md5 = require('md5')

export namespace RpcUtil {
	const RPC_SECRET = 'Lostjoker0'

	export function SignObjectForRPC<T>(obj: T) {
		if (obj.hasOwnProperty('sign')) {
			throw new Error('illegal argument')
		}

		const str = Object.keys(obj)
			.filter(it => it !== 'sign')
			.map(it => `${it}=${obj[it]}`)
			.sort()
			.join('&')

		const sign = md5(md5(str + RPC_SECRET) + RPC_SECRET)

		return Object.assign(obj, {sign})
	}

}
