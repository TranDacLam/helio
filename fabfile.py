from fabric.api import *

ENV = 'uat' # Choices ['uat','production','development']

#ENV = 'production'
SERVERS = {
    'development': '172.16.12.10',
    'uat': '103.95.197.81',
    'production' : '103.95.197.81'
}
BRANCH = {
    'development': 'develop',
    'uat': 'api',
    'production': 'v2'
}

USERS = {
    'development': 'adminvn',
    'uat': 'thangv',
    'production': 'thangv',
}

PASSWORDS = {
    'development': 'Abc@123',
    'uat': 'AdminV00c@Hel10.vn',
    'production': 'AdminV00c@Hel10.vn'
}

VIRTUAL_ENVS = {
    'development': 'source /home/adminvn/envs_root/helio_web_env/bin/activate',
    'uat': 'source /home/thangv/envs/api_helio_web_env/bin/activate',
    'production': 'source /home/thangv/envs/helio_web_env/bin/activate'
}

PATHS = {
    'development': '/home/adminvn/sites/helio_web',
    'uat': '/home/thangv/projects/api_source/helio_web',
    'production': '/home/thangv/projects/helio_web_v2/helio_web'
}

PROCESS_ID = {
    'development': '/tmp/helio_web.pid',
    'uat': '/tmp/helio_api_web.pid',
    'production': '/tmp/helio_web.pid'
}

OUTPUT_ANGULAR = {
    'development': '/home/adminvn/sites/build_angular',
    'uat': '/home/thangv/projects/api_source/build_angular',
    'production': '/home/thangv/projects/helio_web_v2/build_angular'
}

ANGULAR_ENV = {
    'development': 'development',
    'production': 'production',
    'uat': 'uat'
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
            # clean when error
            # rm -r node_modules
            # npm cache clean
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
        
            
    
            




        

