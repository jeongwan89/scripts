#! /bin/bash
# dir -- dos 환경에서 dir 명령어를 수행하는 것처럼 지정한 파일의 내용을 출력한다.
# 표준 dir 플래그 또한 동일하게 동작한다.

function usage
{
cat << EOF >&2
    Usage: $0 [DOS flags] directory or directories
    where:
    /D      sort by columns
    /H      show help for this shell script
    /N      show long listing format with filenames on right
    /OD     sort by oldest to newest
    /O-D    sort by newest to oldest
    /P      pause after each screenful of information
    /Q      show owner of the file
    /S      recursive listing
    /W      use wide listing format
EOF
    exit 1
}

############ MAIN BLOCK ##################

postcmd=""
flags=""

while [ $# -gt 0 ]
do
  case $1 in
    /D        ) flags="$flags -x"      ;;
    /H        ) usage                  ;;
   /[NQW]    ) flags="$flags -l"      ;;
    /OD       ) flags="$flags -rt"     ;;
    /O-D      ) flags="$flags -t"      ;;
    /P        ) postcmd="more"         ;;
    /S        ) flags="$flags -s"      ;;
            * ) # unknown flag: probably a dir specifier
                 #   break;  so let's get out of the while loop
  esac
  shift       # processed flag, let's see if there's another
done

# done processing flags, now the command itself:

if [ ! -z "$postcmd" ] ; then
  ls $flags "$@" | $postcmd
else
  ls $flags "$@" 
fi

exit 0