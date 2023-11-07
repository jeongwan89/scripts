#! /bin/bash
# remember -- 간단한 커맨드란인 기반 비망록

rememberfile="$HOME/.remember"

if [ $# -eq 0 ] ; then 
    # 사용자의 입력을 받아 rememberfile에 추가한다.
    echo "Enter note, end with ^D: "
    cat - >> $rememberfile
    # cat 명령어 - 는 맥락에 따라 stdin이나 stdout를 뜻한다.
else
    # 스크립트에 넘겨진 인자를 .remember 파일에 추가한다.
    echo "$@" >> $rememberfile
fi
exit 0
