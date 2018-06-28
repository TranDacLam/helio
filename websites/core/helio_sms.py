# -*- coding: utf-8 -*-
from Crypto.Cipher import AES
from django.conf import settings
from django.utils import timezone
import requests
import base64
import random


def data_encrypt_cbc(data):
    """ encrypt content data with padding """
    # padding = block_size - (len(data) % block_size)
    # padding = 16 - (len(data) % 16)
    # str_with_padding = data + chr(padding)*padding
    block_size = 16
    padding = block_size - (len(data) % block_size)
    data += chr(padding) * padding

    AES.key_size = 128

    crypt_object = AES.new(key=settings.SMS_KEY,
                           mode=AES.MODE_CBC, IV=settings.SMS_KEY_IV)

    encrypted_text = crypt_object.encrypt(data)

    return base64.b64encode(encrypted_text)


def send_sms(phone, content):
    print "Send SMS"

    try:
        if str(phone).startswith("84"):
            phone_number = str(phone)
        elif str(phone).startswith("0"):
            phone_number = "84" + str(phone)[1:]
        else:
            phone_number = "84" + str(phone)

        print "phone_number::", phone_number

        content_sms = content
        id_sms = random.randint(0, 999)
        time_send = timezone.localtime(timezone.now()).strftime("%Y%m%d%H%M%S")
        brand = settings.SMS_BRAND
        xml = "<content><ReceiverPhone>%s</ReceiverPhone><Message>%s</Message><RequestID>%s</RequestID><BrandName>%s</BrandName><Senttime>%s</Senttime></content>" % (
            str(phone_number), str(content_sms), str(id_sms), brand, str(time_send))

        xml_encode = data_encrypt_cbc(xml.replace("\r\n", ""))  # mã hóa
        user_ctnet = data_encrypt_cbc(settings.SMS_USER)
        pass_ctnet = data_encrypt_cbc(settings.SMS_PASSWORD)

        soap_request = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
        soap_request += "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
        soap_request += "<soap:Body>\n"
        soap_request += "<sendsms xmlns=\"http://tempuri.org/\">\n"
        soap_request += "<user>%s</user>\n" % user_ctnet
        soap_request += "<pass>%s</pass>\n" % pass_ctnet
        soap_request += "<xml>%s</xml>\n" % xml_encode
        soap_request += "</sendsms>\n"
        soap_request += "</soap:Body>\n"
        soap_request += "</soap:Envelope>"

        headers = {
            "Content-type": "text/xml;charset=\"utf-8\"",
            "Accept": "text/xml",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "SOAPAction": "\"http://tempuri.org/sendsms\"",
            "Content-length": "%s" % len(soap_request),
        }
        response = requests.post(
            settings.SMS_URL, data=soap_request, headers=headers)
        print "SOAP  Ressponse ", response.content
        return response.content

    except Exception, e:
        print "Error send_sms : %s" % e
        pass
        return None