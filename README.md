MetroViz
========
MetroViz: Visual Analysis of Public Transportation Data, Blacksburg, VA.

Usage
=====
Running MetroViz requires python2 or python3 with cherrypy and the following database file (too large to be included directly in the git repo):

https://www.dropbox.com/s/pdmp0bhtswtcg7x/Metroviz.zip

git clone the project to obtain the source code and place the Metroviz.db file in the root (MetroViz) directory.

To start MetroViz, execute webserver6.py (runs under python2 or python3) and *either* serve2 or serve3 (depending on your version of python). Then, point your browser at:

localhost:8000/app

To shutdown MetroViz, kill the two server processes.
