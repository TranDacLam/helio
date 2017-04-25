from fabric.api import *

ENV = 'development' # Choices ['uat','production','development']
#ENV = 'production'
SERVERS = {
    'development': '192.168.1.13',
    'uat': '172.16.1.29',
    'production' : '172.16.1.30'
}
BRANCH = {
    'development': 'develop',
    'uat': 'staging',
    'production': 'production'
}

USERS = {
    'development': 'vooc',
    'uat': 'hoanit',
    'production': 'cskh'
}

PASSWORDS = {
    'development': 'vooc@min',
    # 'uat': 'Khoiphat@2016',
    # 'production': 'Helio@@2016'
}

VIRTUAL_ENVS = {
    'development': 'source /home/vooc/envs_root/helio_web_env/bin/activate',
    # 'uat': 'source /home/hoanit/envs_root/helio_web_env/bin/activate',
    # 'production': 'source /home/cskh/envs_root/helio_web_env/bin/activate'
}

PATHS = {
    'development': '/home/vooc/projects/helio_web',
    # 'uat': '/home/hoanit/projects/helio',
    # 'production': '/home/cskh/projects/helio'
}

env.hosts = [SERVERS[ENV]]
env.user = USERS[ENV]
env.password = PASSWORDS[ENV]
env.activate = VIRTUAL_ENVS[ENV]


PROJECT_PATH = PATHS[ENV]
DEBUG = True

VERBOSITY = ('', '') if DEBUG else ('-q', '-v 0')

def restart_app_server():
    """ Restarts remote nginx and uwsgi.
    """
    sudo("su -s /bin/bash www-data")
    sudo("uwsgi --reload /tmp/helio_report.pid")

def deploy():
    with cd(PROJECT_PATH):
        sudo('git checkout %s'%BRANCH[ENV])
        sudo('git fetch {0} origin {1}'.format('' , BRANCH[ENV]))
        sudo('git reset --hard origin/%s'%BRANCH[ENV])
        # run('git reset --hard origin/master')
        sudo('find . -name "*.pyc" -exec rm -rf {} \;')
        
        with cd('websites'):
            with prefix(env.activate):
                run('pip install -r ../requirements.txt')
                sudo('python manage.py collectstatic --noinput')
                restart_app_server()

        

def su(pwd, user, command):
    with settings(
        password= "%s" % pwd,
        sudo_prefix="su %s -c " % user,
        sudo_prompt="Password:"
        ):
        sudo(command)