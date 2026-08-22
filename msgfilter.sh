#!/bin/sh
# msg filter: remove "仿上交" wording from commit messages
sed 's/页面历史仿上交（/页面历史（/g; s/（仿上交结构）//g'
