#! /usr/bin/python3 
import sys
import os
sys.path.insert(0, "/var/www/server")

from server import create_app
application = create_app()
application.secret_key = 'fadshniuewofdsijfwpajogfudainfewfiaj'