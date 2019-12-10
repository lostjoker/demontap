import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import Bottleneck from 'bottleneck'
import Web3 from 'web3'
import log4js from 'log4js'
import { RedisService } from '../db/RedisService'
import AxiosRequestService from './AxiosRequestService'
import User from '../../models/User'
import { UserService } from '../modules/UserService'
import { ConfigService } from '../config/ConfigService'

type ChainData = {
    ethScan: string
    erc20: string
}

type EthscanTokentxResponse = {
    status: '0' | '1'
    message: string
    result: Array<{
        blockNumber: string
        timeStamp: string
        hash: string
        nonce: string
        blockHash: string
        from: string
        contractAddress: string
        to: string
        value: string
        tokenName: string
        tokenSymbol: string
        tokenDecimal: string
        transactionIndex: string
        gas: string
        gasPrice: string
        gasUsed: string
        cumulativeGasUsed: string
        input: string
        confirmations: string
    }>
}

@Injectable()
export default class EthService implements OnModuleInit {
    readonly ETHERSCAN_API_KEY = 'KKMVGWIIWIUQKE56AZQU3M4RN1GYJSWEPD'
    readonly ETHERSCAN_LIMITER = new Bottleneck({ minTime: 200, maxConcurrent: 1 })

    private readonly logger = log4js.getLogger(this.constructor.name)

    private readonly web3 = new Web3()

    constructor(
        private readonly redis: RedisService,
        private readonly axios: AxiosRequestService,
        private readonly config: ConfigService,

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    onModuleInit() {
        setInterval(() => this.ETHERSCAN_LIMITER.schedule(async () => this.checkEvents()), 3500)
    }

    generateAddr() {
        return this.web3.eth.accounts.create()
    }

    private checkEvents() {
        Promise.resolve()
            .then(async () => {
                this.logger.trace('正在检查充值记录……')

                const params = {
                    module: 'account',
                    action: 'tokentx',
                    contractaddress: this.config.ETHConfig.erc20Addr,
                    apikey: this.ETHERSCAN_API_KEY,
                    sort: 'desc',
                    page: 1,
                    offset: 500,
                }

                const res = await this.axios.request<EthscanTokentxResponse>({
                    url: `${this.config.ETHConfig.ethScan}/api`,
                    method: 'get',
                    params,
                    // headers: { 'Content-Type': 'application/json' },
                })

                // const res = await Axios.get<EthscanTokentxResponse>(`${this.chain.ethScan}/api`, {
                //     params,
                //     proxy: {
                //         host: '127.0.0.1',
                //         port: 1086,
                //     },
                // })

                if (res?.data?.status === '1') {
                    const result = res.data.result
                    for (const tx of result) {
                        if (Number(tx.confirmations) > 10) {
                            const key = `${tx.blockNumber}_${tx.hash}_${tx.from}_${tx.to}`

                            if (!(await this.redis.sismember('eth:s_confirmedTx', key))) {
                                // todo

                                const user = await User.findOne({ where: { ethChargeAddr: tx.to } })

                                if (user) {
                                    const value = Number(this.web3.utils.fromWei(tx.value)).toFixed(
                                        5,
                                    )

                                    // await User.createQueryBuilder('user')
                                    //     .update()
                                    //     .set({ egtCash: () => `egtCash + ${value}` })
                                    //     .where('id = :id', { id: user.id })
                                    //     .execute()

                                    await this.userService.addEgt(user, value)

                                    this.logger.info(`用户${user.id}充值了${value} EGT`)
                                } else {
                                    this.logger.debug(`未找到充值地址为${tx.to}的用户`)
                                }

                                this.logger.info(`已处理交易：${tx.hash}`)
                                await this.redis.sadd('eth:s_confirmedTx', key)
                            }
                        }
                    }
                } else {
                    this.logger.warn(res?.data?.message ?? res.statusText)
                }
            })
            .catch(err => {
                this.logger.error(err)
            })
    }
}
