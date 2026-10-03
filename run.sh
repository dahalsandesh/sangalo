#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
while true; do
    python3 "$DIR/server.py"
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 99 ]; then
        echo "Haven shutdown requested (exit code 99)."
        exit 0
    fi
    sleep 1
done
