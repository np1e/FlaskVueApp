#!/usr/bin/env bash

# store path to script
PROJECT_DIR=$(pwd)/$(dirname "$0")

# set environment variables for flask
export CONFIG="$PROJECT_DIR/config.py"
export FLASK_APP="$PROJECT_DIR/app.py"
export FLASK_ENV="development"
export FLASK_DEBUG="True"

# launch app
flask run