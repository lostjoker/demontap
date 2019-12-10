//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

	public textField: egret.TextField
	public img_bg: eui.Image

    public constructor() {
        super()
        this.createView()
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `Loading...${current}/${total}`
    }

    private createView(): void {
	    this.img_bg = new eui.Image()
//        this.img_bg.source = Config.ADDRESS_CONFIG.SITE_ADDRESS_BASE + "/launch.png";
	    this.img_bg.width = 800
	    this.img_bg.height = 1280
	    this.addChild(this.img_bg)
	    this.textField = new egret.TextField()
	    this.textField.width = 800
	    this.textField.height = 50
	    this.textField.background = true
	    this.textField.backgroundColor = Const.GAME_COLOR.TIME_ENOUGH
	    this.textField.textColor = Const.GAME_COLOR.WHITE
	    this.textField.textAlign = 'center'
	    this.textField.verticalAlign = 'middle'
	    this.textField.text = '恶魔们正向你聚拢...'
	    this.addChild(this.textField)
    }
}