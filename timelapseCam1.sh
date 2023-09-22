#!/bin/bash

set -e

DATE=$(date +"%Y-%m-%dT%H-%M-%S")
DAY=$(date +"%Y-%m-%d")
SNAPSHOTS_DIR=/mnt/timelapse/camera1
SNAPSHOT_PATH="$SNAPSHOTS_DIR/$DAY/$DATE.jpg"
CURRENT_PATH="$SNAPSHOTS_DIR/current.jpg"

if [ ! -d "$SNAPSHOTS_DIR" ] ; then
    echo 디렉토리가 존재하지 않는다.
    echo eerrtt | sudo -S mkdir "$SNAPSHOTS_DIR"
else
    echo 디렉토리가 존재한다.
fi

if [ ! -e "$SNAPSHOTS_DIR/numbering.buff" ] ; then # 파일이 존재하지 않으면
    # echo "파일이 없다고 해서 들어왔습니다."
    echo eerrtt | sudo -S touch "$SNAPSHOTS_DIR/numbering.buff"
    echo eerrtt | sudo -S echo $DAY | sudo tee "$SNAPSHOTS_DIR/numbering.buff" > /dev/null  # 파일에 덮어 쓰기를 먼저하고
    echo eerrtt | sudo -S echo 1 | sudo tee -a "$SNAPSHOTS_DIR/numbering.buff" > /dev/null  # 나중에 추가하여 기록한다.
    FREADDAY=$DAY
    FREADNUM=1
else
    # 파일이 존재하면,while로 읽는다. 한꺼번에 읽으니까 배열을 이용하자 ARRAY[]
    # 배열활용때는 ${Arr[0...3]}의 형태로 변수를 참조할 수 있다.
    readarray -t Arr < "$SNAPSHOTS_DIR/numbering.buff"
    FREADDAY=${Arr[0]}
    FREADNUM=${Arr[1]}
fi

if [ $DAY == $FREADDAY ] ; then
    # 같은 날에 기록한다.
    FREADNUM=$(($FREADNUM + 1))
    echo eerrtt | sudo -S echo $DAY | sudo tee "$SNAPSHOTS_DIR/numbering.buff" > /dev/null  # 파일에 덮어 쓰기를 먼저하고
    echo eerrtt | sudo -S echo $FREADNUM | sudo tee -a "$SNAPSHOTS_DIR/numbering.buff" > /dev/null  # 나중에 추가하여 기록한다.
else
    # 다른 날이라면.
    # 1. 새로운 디렉토리를 만들고
    echo eerrtt | sudo -S mkdir -p "$SNAPSHOTS_DIR"/"$DAY"
    # 2. numbering.buff에 날짜를 새로 쓰고
    echo eerrtt | sudo -S echo $DAY | sudo tee "$SNAPSHOTS_DIR/numbering.buff" > /dev/null
    # 3. 기억할 숫자로는 1을 대입한다.
    echo eerrtt | sudo -S echo 1 | sudo tee -a "$SNAPSHOTS_DIR/numbering.buff" > /dev/null  # 나중에 추가하여 기록한다.
    FREADNUM=1
fi

# echo eerrtt | sudo -S mkdir -p "$SNAPSHOTS_DIR"/"$DAY"

# echo eerrtt | sudo -S raspistill \
#     --width 1280\
#     --height 960\
#     --quality 100\
#     --output "$SNAPSHOT_PATH"

# cd $SNAPSHOTS_DIR
# cp $SNAPSHOT_PATH $CURRENT_PATH