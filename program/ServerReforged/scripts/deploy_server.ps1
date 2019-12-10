# script below should run in parent directory
Set-Location $PSScriptRoot/..

wsl ansible-playbook ./scripts/deploy_server.yml
