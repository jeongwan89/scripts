#!/bin/bash

set -e

DATE=$(date +"%Y-%m-%dT%H-%M-%S")
DAY=S(date +"%Y-%m-%d")
SNAPSHOTS_DIR=/mnt/timelapse
SNAPSHOT_PATH="$SNAPSHOTS_DIR/$DAY/$DATE.jpg"
CURRENT_PATH="$SNAPSHOTS_DIR/current.jpg"

echo eerrtt | sudo -S mkdir -p "$SNAPSHOTS_DIR"/"$DAY"

echo eerrtt | sudo -S raspistill \
    --width 1280\
    --height 960\
    --quality 100\
    --output "$SNAPSHOT_PATH"

cd $SNAPSHOTS_DIR
cp $SNAPSHOT_PATH $CURRENT_PATH
