# Flask Vue App

## Verwendung
Zunächst sollte ein Python3 Virtualenv erzeugt werden

    python3 -m venv venv
    source venv/bin/activate

Danach können bei aktiviertem venv alle notwendigen Dependencies mittels

    pip install -r requirements.txt

heruntergeladen werden.

Um den Webserver leicht starten zu können liegt ein kleines Shellscript
bei, dass alle notwendigen Flask-Umgebungsvariablen aufsetzt und mittels

    ./run.sh

ausgeführt werden kann. Der Befehl sollte aus dem Wurzelverzeichnis des
Repositories ausgeführt werden, kann aber theoretisch von überall
verwendet werden. Getest wurde das ganze nur unter Linux mit Bash.

## Wichtige Dateien und Ordner
- `./requirements.txt` enthält die Namen aller Abhängigkeiten des Projekts,
  damit sie schnell installiert werden könnnen
- `./fakedata.py` ist ein Script das automatisch eine Datenbank aufsetzt und
  mit Testdaten befüllt
- `./config.py` enthält die Konfiguration des Flask Applikation
- `./app.py` stellt den Einstiegspunkt der Applikation dar und verdrahtet
  den API-Blueprint, Vue-Frontend und Datenbank miteinander. Konfiguriert
  die Routen
- `./static` enthält alle JS, CSS und Bildresourcen die von der Applikation
  verwendet werden sollen.
- `./templates/index.html` enthält das notwendige HTML zum Start der Vue-
  Applikation und lädt je nach gewähltem Environment die richtige Version
  von Vue. Wenn die Applikation im DEBUG-Modus läuft wird die Entwicklungs-
  version von Vue geladen. Andernfalls wird die minifizierte Version 
  verwendet, die für den Einsatz in Produktionsumgebungen geeignet ist.
- `./boilerplate.sqlite` Datenbank, die durch `fakedata.py` erzeugt wurde.

## Weniger wichtige Dateien
- `.gitignore` enthält Muster für Ordner und Dateinamen, die nicht versioniert
  werden sollen
- `setup.cfg` enthält Einstellungen für den Pythonlinter flake8 und den Formatter
  yapf, die etwas längere Zeilen, als von Pep8 gefordert, zulassen

## Weiterführende Links
- [Vue.js Guide](https://vuejs.org/v2/guide/)
- [Vue Dev-Tools für Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Vue Dev-Tools für Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Flask](http://flask.pocoo.org/docs/1.0/)
- [Flask-Sqlalchemy](http://flask-sqlalchemy.pocoo.org/2.3/)
