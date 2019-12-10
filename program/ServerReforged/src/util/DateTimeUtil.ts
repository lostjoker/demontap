import moment from 'moment'
import * as _ from 'lodash'

type DateNumber = number

/**
 * 将时间转换为YYYYMMDD格式的日期数字。
 * @param time 时间
 */
export function getDateNumber(time: moment.Moment | string | Date | number = moment()): DateNumber {
	if (_.isNumber(time) && time > 19000101 && time < 29991231) {
		// 自身特征
		return time
	}
	return parseInt(moment(time).format('YYYYMMDD'), 10)
}

export function dateNumberToMoment(dateNumber: DateNumber): moment.Moment {
	return moment(dateNumber + 'T11')
}

export function normalDatetime(time: moment.Moment) {
	return time.format('YYYY-MM-DD HH:mm:ss')
}
