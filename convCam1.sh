YESTERDAY=$(date +"%Y-%m-%d" -d '1-day')
SNAPSHOTS_DIR=/mnt/timelapse/camera1
SNAPSHOT_PATH="$SNAPSHOTS_DIR/$DAY"
echo eerrtt | sudo -S ffmpeg -framerate 24 -pattern_type glob -i "$SNAPSHOT_PATH/*.jpg" -s:v 1280X960 -c:v libx264 -crf 17 -pix_fmt yuv420p "$SNAPSHOTS_DIR/$DAY.mp4"
