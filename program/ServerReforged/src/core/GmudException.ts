/* tslint:disable:max-classes-per-file */

export enum StatusCode {
	OK = 0,
	InternalServerErr = 10001,
	Unauthorized = 10003,
	BadRequest = 10004,
	Conflict = 10005,
	Forbidden = 10006,

	TokenExpired = 20000,
	UsernameOrPasswordWrong = 20001,
	ValidationCodeWrong = 20002,

	Unknown = 32767,
}

export default class GmudException extends Error {
	constructor(msg: string, public readonly code: StatusCode = StatusCode.InternalServerErr) {
		super(msg)
	}

	toString(): string {

		let str = `[Err ${this.code}] ${this.message}`

		if (this.stack) {
			str += `\n- ${this.stack.split('\n').join('\n- ')}`
		}

		return str
	}

}

export class TokenExpiredException extends GmudException {
	constructor(msg: string) {
		super(msg, StatusCode.TokenExpired)
	}
}

export class UsernameOrPasswordWrongException extends GmudException {
	constructor(msg: string) {
		super(msg, StatusCode.UsernameOrPasswordWrong)
	}
}

export class ValidationCodeWrongException extends GmudException {
	constructor(msg: string) {
		super(msg, StatusCode.ValidationCodeWrong)
	}
}
