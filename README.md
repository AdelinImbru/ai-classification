# AI Classification tool backend

## Setup
#### Install python

#### Only on Windows download and install wsl2

### On macOS

* install virtualenv-wrapper
```shell
python -m pip install virtualenv virtualenvwrapper
```

### On Windows and Linux
* install pacman

```shell
sudo apt update
sudo apt install pacman
```

* have virtualenv-wrapper installed

```shell
sudo pacman -S python-virtualenvwrapper
```

* find your shell

```shell
echo $0
```

* based on your shell edit rc file and add shell helpers

```shell
vim ~/.zshrc
```

(or `.bashrc` depending on your shell)

* edit and append

```text
export WORKON_HOME=~/.virtualenvs
source /usr/bin/virtualenvwrapper.sh
```

### On macOS
```text
export WORKON_HOME=~/.virtualenvs
source /Users/<current_user>/ai-classification/venv/bin/virtualenvwrapper.sh
```
see
https://gist.github.com/duonghuuphuc/7939cfbf82d9664274d299fff3d4c205

(depending on your os `virtualenvwrapper.sh` location might be different)

* create a venv and install dependencies

```shell
mkvirtualenv ai
workon ai
pip install -r requirements.txt
```

(to deactivate venv type `deactivate` in the shell)

### Environment

A `.env` file must be provided

sample:

```dotenv
OPENAI_API_KEY=<openai key>
MODEL_NAME=gpt-3.5-turbo-0613
MODEL_NAME_FALLBACK=gpt-4-1106-preview
#MODEL_NAME=gpt-4
CHECK_PROMPT_MODEL_NAME=ft:gpt-3.5-turbo-0613:dialogdata-ro-srl::8KqmWNJZ
#CHECK_PROMPT_MODEL_NAME=gpt-4-1106-preview
TEMPERATURE=0
MAX_TOKENS=1000
DEBUG=true
CHECK_PROMPT=true
DESCRIPTIONS=true
SIZE=5
MEMORY_SIZE=2
```

### How to openai key

https://platform.openai.com/account/api-keys

## Local Install

#### Clean database (optional)

```shell
./manage.py reset_db --noinput
```

#### Steps

1. Init db

```shell
./manage.py makemigrations
./manage.py migrate --run-syncdb
````

2. Add superuser for admin

```shell
./manage.py sample_admin
```

or

```shell
./manage.py createsuperuser
```

3. Run server

```shell
./manage.py runserver_plus
```


# Ai Classification tool frontend

### Install Node.js

https://nodejs.org/en/download/current

### Install Angular

```shell
npm install -g @angular/cli
```

### Install dependencies

```shell
npm install
```

### Run application

```shell
ng serve
```
