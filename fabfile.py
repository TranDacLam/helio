from fabric.api import *

ENV = 'development' # Choices ['uat','production','development']

#ENV = 'production'
SERVERS = {
    'development': '172.16.12.10',
    # 'uat': '49.156.53.49',
    'production' : '49.156.53.49',
    'api' : '49.156.53.49'
}
BRANCH = {
    'development': 'develop',
    # 'uat': 'uat',
    'production': 'production',
    'api': 'production',
}

USERS = {
    'development': 'adminvn',
    # 'uat': 'thangv',
    'production': 'thangv',
    'api': 'thangv'
}

PASSWORDS = {
    'development': 'Abc@123',
    # 'uat': 'ThangV@@123',
    'production': 'develop@vooc.vn',
    'api': 'develop@vooc.vn'
}

VIRTUAL_ENVS = {
    'development': 'source /home/adminvn/envs_root/helio_web_env/bin/activate',
    # 'uat': 'source /home/thangv/envs/helio_web_env/bin/activate',
    'production': 'source /home/thangv/envs/helio_web_env/bin/activate',
    'api': 'source /home/thangv/envs/api_helio_web_env/bin/activate'
}

PATHS = {
    'development': '/home/adminvn/sites/helio_web',
    # 'uat': '/home/thangv/projects/helio_web/',
    'production': '/home/thangv/projects/helio_web/',
    'api' : '/home/thangv/projects/api_source/helio_web'
}

PROCESS_ID = {
    'development': '/tmp/helio_web.pid',
    # 'uat': '/home/thangv/projects/helio_web/',
    'production': '/tmp/helio_web.pid',
    'api' : '/tmp/helio_api_web.pid'
}

OUTPUT_ANGULAR = {
    'development': '/home/adminvn/sites/build_angular',
    'api': None,
    'uat': '/home/api/projects/build_angular',
    'production': None,
}

ANGULAR_ENV = {
    'development': 'development',
    'production': 'production'
}

env.hosts = [SERVERS[ENV]]
env.user = USERS[ENV]
env.password = PASSWORDS[ENV]
env.activate = VIRTUAL_ENVS[ENV]


PROJECT_PATH = PATHS[ENV]
DEBUG = True

VERBOSITY = ('', '') if DEBUG else ('-q', '-v 0')

def restart_web_server():
    """ Restarts remote nginx and uwsgi.4
    """
    with cd(PROJECT_PATH):
        with cd('websites'):
            with prefix(env.activate):
                run('pip install -r ../requirements.txt')
                run('python manage.py collectstatic --noinput')
                run('python manage.py migrate')
                if ENV == "production":
                    sudo('systemctl restart uwsgi_helio')
                else:
                    sudo('su -s /bin/bash www-data -c "%s;%s" '%(env.activate,"uwsgi --reload %s"%PROCESS_ID[ENV]))

def restart_admin_marketing():
    with cd(PROJECT_PATH):
        with cd('admin-marketing'):
            run('npm install')
            run("ng build --prod --environment=%s --base-href=/marketing/ --output-path=%s"%(ANGULAR_ENV[ENV], OUTPUT_ANGULAR[ENV]))
            run("rsync -av %s/* build/helio_admin/"%(OUTPUT_ANGULAR[ENV]))

def deploy():
    with cd(PROJECT_PATH):
        run('git checkout %s'%BRANCH[ENV])
        run('git fetch {0} origin {1}'.format('' , BRANCH[ENV]))
        run('git reset --hard origin/%s'%BRANCH[ENV])
        # run('git reset --hard origin/master')
        run('find . -name "*.pyc" -exec rm -rf {} \;')

    restart_web_server()
    restart_admin_marketing()
        
            
    
            




        

