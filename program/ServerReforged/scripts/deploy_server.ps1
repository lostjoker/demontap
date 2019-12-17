# script below should run in parent directory
Set-Location $PSScriptRoot/..

./scripts/config_set_alpha.ps1

wsl ansible-playbook ./scripts/deploy_server.yml
