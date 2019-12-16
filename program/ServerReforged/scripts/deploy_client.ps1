$loc = Get-Location

Set-Location $PSScriptRoot

./config_set_alpha.ps1

# script below should run in client directory
Set-Location $PSScriptRoot/../../DtapClient

Remove-Item ./bin-release/web/latest -Recurse

egret publish --version latest

#wsl ansible-playbook ./scripts/deploy_client.yml

wsl ~/.local/bin/coscmd delete -r /egret/
wsl ~/.local/bin/coscmd upload -r ./bin-release/web/latest/ egret

Set-Location $loc
