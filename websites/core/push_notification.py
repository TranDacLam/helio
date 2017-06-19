from push_notifications.models import APNSDevice, GCMDevice

def send_notification_all_user(subject, message, **kwargs):
    try:
        data_notify = {"title": subject, "body" : message}
        for name, value in kwargs.items():
            data_notify[name] = value
            
        devices_ios = APNSDevice.objects.all()
        devices_ios.send_message(message=data_notify, user_flag_notification=True)

        fcm_devices = GCMDevice.objects.all()
        fcm_devices.send_message(subject, extra=data_notify, user_flag_notification=True)
        return True
    except Exception, e:
        print "Error send_notification_all_user : ",e
        return False