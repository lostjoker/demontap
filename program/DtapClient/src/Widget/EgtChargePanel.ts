// const web3 = new Web3()

class EgtChargePanel extends eui.Component implements eui.UIComponent {
    lblChargeAddr: eui.Label

    @byLanguage()
    lblCharge1
    @byLanguage()
    lblCharge2
    @byLanguage()
    btnCopy
    @byLanguage()
    btnCharge6
    @byLanguage()
    btnCharge12
    @byLanguage()
    btnCharge30
    @byLanguage()
    btnCharge192
    @byLanguage()
    btnCharge368
    @byLanguage()
    btnCharge648

    public constructor() {
        super()
        this.skinName = 'EgtChagePanel'
    }

    @tapListener('btnCharge6')
    charge6() {
        this.callCharge(6)
    }
    @tapListener('btnCharge12')
    charge12() {
        this.callCharge(12)
    }
    @tapListener('btnCharge30')
    charge30() {
        this.callCharge(30)
    }
    @tapListener('btnCharge192')
    charge192() {
        this.callCharge(192)
    }
    @tapListener('btnCharge368')
    charge368() {
        this.callCharge(368)
    }
    @tapListener('btnCharge648')
    charge648() {
        this.callCharge(648)
    }

    async callCharge(value: number) {
        const err = await this.metamaskError()
        if (err) {
            Tools.Hint(err)
            return
        }

        try {
            const accounts = await ethereum.send('eth_requestAccounts')
            // You now have an array of accounts!
            // Currently only ever one:
            // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']

            const contract = web3.eth.contract(ERC20ABI).at(Config.ERC20_ADDR)

            const ethChargeAddr = Player.me.ethChargeAddr
            contract.transfer(
                ethChargeAddr,
                web3.toWei(value, 'ether'),
                { from: accounts[0] },
                e => {
                    // if (!e) {
                    //     Tools.Hint('转账成功后请等待区块确认！')
                    // }
                },
            )
        } catch (error) {
            if (error.code === 4001) {
                // EIP 1193 userRejectedRequest error
                Tools.HintByLanguage('UI/hint_pleaseLoginMetamask')
            } else {
                console.error(error)
            }
        }

        // // Connect to the network
        // const provider = new ethers.providers.Web3Provider(ethereum)
        //
        // // The address from the above deployment example
        // const contractAddress = '0xf0562a5068defb60135d8f0f059a0614941b7e12'
        //
        // // We connect to the Contract using a Provider, so we will only
        // // have read-only access to the Contract
        // const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
        //
        // contract.connect(provider)

        // tslint:disable-next-line:no-string-literal
        // const web3 = new Web3(window['ethereum'])
    }

    @tapListener('btnCopy')
    copyAddress() {
        if (dtap.copyText(Player.me.ethChargeAddr)) {
            Tools.HintByLanguage('UI/hint_copy_succ')
        }
    }

    @eventListener(dtap.EVENT_PLAYER_UPDATED, '@gameui')
    updateText() {
        this.lblChargeAddr.text = Player.me.ethChargeAddr
    }

    /**
     * 调用合约前检查metamask的错误。
     * @returns 如果没错返回null，否则返回错误信息
     */
    async metamaskError(): Promise<string | null> {
        if (typeof web3 === 'undefined' || typeof ethereum === 'undefined') {
            return Promise.resolve(GameData.getText('UI/hint_pleaseLoginMetamask'))
        }
        //
        // if (null === web3.version.network) {
        //     return Promise.resolve('请登录Metamask后刷新页面!')
        // }

        return new Promise<string | null>(resolve => {
            web3.version.getNetwork((error, result) => {
                if (error) {
                    console.log(error)
                    resolve(GameData.getText('UI/hint_pleaseLoginMetamask'))
                    return
                }

                resolve(null)

                // if (result != G.PLAYER.ethNetId) {
                //     resolve('请在MetaMask选择Kovan测试网络!')
                //     return
                // }
                // web3.eth.getAccounts((error, result) => {
                //     if (error) {
                //         console.log(error)
                //         resolve('请登录Metamask!')
                //         return
                //     }
                //
                //     if (
                //         result[0] &&
                //         result[0].toLowerCase() === G.PLAYER.ethBindingAddress.toLowerCase()
                //     ) {
                //         resolve(null)
                //         return
                //     }
                //
                //     resolve('请在MetaMask选择当前玩家绑定的账号！')
                // })
            })
        })
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
    }

    protected childrenCreated(): void {
        super.childrenCreated()
    }
}
