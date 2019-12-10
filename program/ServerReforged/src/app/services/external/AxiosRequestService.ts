import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/ConfigService'
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

@Injectable()
export default class AxiosRequestService {
    readonly gproxyEnabled = !this.config.isProduction()

    constructor(private readonly config: ConfigService) {}

    async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (this.gproxyEnabled) {
            return Axios.post('http://qchk.bugsnet.cn:3000/', config)
        } else {
            return Axios(config)
        }
    }
}
