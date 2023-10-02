#!/usr/bin/python

from bottle import route, post, request, run
import psutil 

@route('/systemPerformance')
def getSystemPerformance():

    systemPerformance = {'cpu': psutil.cpu_percent(), 'ram': psutil.virtual_memory().percent}

    return dict(data=systemPerformance)

#/@post('/logines') # or @route('/login', method='POST')
#/def do_login():
#/   username = request.forms.get('username')
#/    password = request.forms.get('password')
#/    systemPerformance = {'cpu': username, 'ram': password}

#/    return dict(data=systemPerformance)
#/logines?username=pavon&password=1234

run(host='localhost', port=3300, debug=True)