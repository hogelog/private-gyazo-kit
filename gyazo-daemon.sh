#!/bin/sh

appdir=`echo $(cd $(dirname $0);pwd)`
pidfile=$appdir/gyazo.pid
args="--name gyazo --pidfile $pidfile --core --chdir $appdir"

running() {
  daemon $args --running
}

case "$1" in
    start)
      echo -n "Starting gyazo..."
      if running; then
        echo "already running."
        exit 0
      fi

      daemon $args -- node gyazo.js
      echo "done."
    ;;

    stop)
      echo -n "Stopping gyazo... "
      if ! running; then
        echo "wasn't running."
        exit 0
      fi

      daemon $args --stop
      echo "done."
    ;;

    restart)
      $0 stop
      sleep 1
      $0 start
    ;;

    status)
      if running; then
        echo "gyazo is running."
      else
        echo "gyazo is NOT running."
      fi
    ;;

    *)
      echo "Usage: $0 {start|stop|restart|status}"
      exit 1
    ;;
esac
