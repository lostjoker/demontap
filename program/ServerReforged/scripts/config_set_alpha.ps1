# script below should run in parent directory
Set-Location $PSScriptRoot/..

node --require ts-node/register ./scripts/config_set.ts alpha
