#!/usr/bin/env bash
docker compose run backend flask -A app.main:app db "$@"