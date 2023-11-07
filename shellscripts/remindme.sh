#! /bin/bash
# remindme -- 데이터 파일에서 일치하는 행을 찾는다. 인자가 없으면,
#   데이터 파일 내용 전체를 보여준다.

rememberfile="$HOME/.remember"

if [ ! -f $rememberfile ] ; then
    echo "$@: You don't seem to have a .remember file." >&2
    echo "To remedy this, please use 'remember' to add reinders" >&2
    exit 1
fi

if [ $# -eq 0 ] ; then
    # 검색 조건이 없으면 rememberfile 전체를 보여준다.
    more $rememberfile
else
    # 그렇지 않으면, 주어진 검색 조건을 파일에서 찾아 결과를 깔끔하게 보여준다.
    grep -i -- "$@" $rememberfile | ${PAGER:-more}
fi

exit 0
