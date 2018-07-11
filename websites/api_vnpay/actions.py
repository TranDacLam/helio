from django.utils.translation import ugettext_lazy as _
from django.conf import settings
import traceback
import requests
import json
from core import helio_sms
import api.utils as utils
from django.contrib.sites.models import Site
import api.helper as helper
import core.constants as constants

def send_mail_reload_success(is_secure, email, reload_order):
    try:
        message_html = "websites/email/reload_success.html"
        message_plain = "websites/email/reload_success.txt"
        subject = _("[Helio] Reload Successful !")

        protocol = 'http'
        if is_secure:
            protocol = 'https'
        logo_url = '/static/assets/websites/images/logo_bottom.png'
        data_binding = {
            "protocol": protocol,
            'URL_LOGO': logo_url,
            'reload_order': reload_order,
            'site': str(Site.objects.get_current()),
            'HOT_LINE': settings.HOT_LINE
        }
        # Send email reload success
        utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, 
                        email_from=settings.DEFAULT_FROM_EMAIL, email_to=[email], data=data_binding)

    except Exception, e:
        print "Error send_mail_reload_success : ", traceback.format_exc()

def send_mail_reload_error(is_secure, email, reload_order, amount, reason):
    try:
        message_html = "websites/email/reload_errrors.html"
        message_plain = "websites/email/reload_errrors.txt"
        subject = _("[Helio] Reload Errors !")

        protocol = 'http'
        if is_secure:
            protocol = 'https'
        logo_url = '/static/assets/websites/images/logo_bottom.png'
        data_binding = {
            "protocol": protocol,
            'URL_LOGO': logo_url,
            'reload_order': reload_order,
            'site': str(Site.objects.get_current()),
            'HOT_LINE': settings.HOT_LINE,
            'reason': reason,
            'amount': amount
        }
        # Send email reload success
        utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, 
                                email_from=settings.DEFAULT_FROM_EMAIL, email_to=email, data=data_binding)    
    except Exception, e:
        print "Error send_mail_reload_error : ", e


""" 
    Card_State = 1: suspended
    Card_State = 2: replaced
    Default: Card Invalid
"""
def state_mapping_error(card_state):
    switcher = {
        1: _("Card is suspended."),
        2: _("Card is replaced.")
    }
    return switcher.get(card_state, _("Card Invalid"))

"""
    Step1: Call DMZ get card information by barcode
    Step2: Check card information valid.
        Card_state = 0: Active
        Card_State = 1: suspended
        Card_State = 2: replaced
    
"""
def call_api_vefiry_card_barcode(barcode):
    try:
        headers = {'Authorization': settings.DMZ_API_TOKEN}
        card_information_api_url = '{}card/{}/information/'.format(
            settings.BASE_URL_DMZ_API, barcode)

        # Call DMZ get card infomation
        response = requests.get(
            card_information_api_url, headers=headers)

        # handle decoding json
        try:
            # convert response text to json
            json_data = response.json()
        except ValueError as e:
            print "Error convert json : %s" % e
            return {"code": 500, "message": _("Handle data error."), "fields": ""}

        # Mapping status dmz reponse with reponse
        result = helper.code_mapping_error_dmz(response.status_code, json_data)
        if response.status_code != 200 :
            print "DMZ Response Text:::", response.text
            return result

        # if barcode exist in dmz then return data else return {}
        if not result:
            return {"code": 400, "message": _(
                "Card barcode not found."), "fields": ""}

        # Only accept reload for guest member gold
        if result['card_status_code'] not in constants.CARD_TYPE_ACCEPT_RELOAD:
            return {"code": 400, "message": _("Card can not reload."), "fields": ""}

        # Only accept reload for current card ( carrd active)
        if result['card_state'] != 0:
            message = state_mapping_error(result['card_state'])
            return {"code": 400, "message": message, "fields": ""}

        return {"code": 200, "message": _("Card Valid"), "fields": ""}

    except requests.Timeout:
        print "API connection timeout"
        return {"code": 500, "message": _("API connection timeout"), "fields": ""}

    except Exception, e:
        print('ticket_transfer: %s', traceback.format_exc())
        return {"code": 500, "message": "%s" % e, "fields": ""}

"""
    Call DMZ API to update cash balance
"""
def call_api_reload_to_card_barcode(reload_order):
    print "Helio Card Reload"
    try:
        card_barcode = reload_order.barcode
        email = reload_order.email
        full_name = reload_order.full_name
        phone = reload_order.phone
        reload_amount = reload_order.amount

        headers = {
            'Content-Type': 'application/json',
            'Authorization': settings.DMZ_API_TOKEN
        }
        reload_api_url = '{}helio/card/reload/'.format(
            settings.BASE_URL_DMZ_API)

        params_api = {
            "card_barcode": card_barcode,
            "email": email,
            "full_name": full_name,
            "phone": phone,
            "reload_amount": reload_amount,
            "system_name": "helio_app"
        }

        # Call DMZ get card infomation
        response = requests.post(
            reload_api_url, data=json.dumps(params_api), headers=headers)

        # handle decoding json
        try:
            # convert response text to json
            json_data = response.json()
        except ValueError as e:
            print "Error convert json : %s" % e
            return {"code": 500, "message": _("Handle data error."), "fields": ""}

        # Mapping status dmz reponse with reponse
        result = helper.code_mapping_error_dmz(response.status_code, json_data)
        if response.status_code != 200 :
            print "DMZ Response Text:::", response.text
            return result

        # Get data from dmz reponse
        return {'code': 200, "data": json_data}

    except requests.Timeout:
        print "API connection timeout"
        return {"code": 500, "message": _("API connection timeout"), "fields": ""}

    except Exception, e:
        print('ticket_transfer: %s', traceback.format_exc())
        return {"code": 500, "message": "%s" % e, "fields": ""}

"""
    Payment success and reload success handle 
"""
def reload_sucess_handle(request, reload_order, email, phone, cash_balance):

    print "Reload Success"
    """ Handle for vnpayemnt ipn call and process booking success"""
    reload_order.order_status = "done"
    reload_order.save()

    if phone:
        cash_balance = '{:,.0f}'.format(cash_balance)
        content_sms = """Ban vua duoc nap %s VND vao the %s. Ma giao dich: %s. So du hien tai: %s. Noi dung nap tien: """  % (reload_order.amount, 
                                reload_order.barcode, reload_order.order_id, cash_balance)

        content_sms += str(reload_order.order_desc.replace("\r\n", ""))
        # Send SMS for user
        helio_sms.send_sms(phone, content_sms)

    #  Send Email
    if email:
        print "Send Email"
        send_mail_reload_success(request.is_secure(), email, reload_order)


"""
    Vnpay payment success but reload errors handle
    Sent sms to customer
    Send email to admin

"""
def reload_error_handle(request, reload_order, amount, reason):
    """ Handle for vnpayemnt ipn call and process reload errors"""
    reload_order.order_status = "reload_error"
    reload_order.save()

    content_sms = """Nop tien khong thanh cong. Vui long lien he: %s neu ban van chua duoc hoan tien. Ma giao dich: %s. Noi dung nap tien: """ % (settings.HOT_LINE, reload_order.order_id)
    content_sms += str(reload_order.order_desc.replace("\r\n", ""))
    # Send SMS for user
    helio_sms.send_sms(reload_order.phone, content_sms)

    # Send email notification for admin transaction error
    send_mail_reload_error(request.is_secure(), settings.HELIO_ADMIN_EMAIL_TO_LIST, reload_order, amount, reason)
            
"""
    Process after payment on vnpay success
    Step 1: Check amount vnpay return and amount reload is match
        Case 1: If amount is match then call api update amount in dmz
            Case1: Reload success then send email and sms to recieved custom. 
            Case2: Reload error send email to admin and sms to customer 
        Case 2: If amount not match then send sms to customer and email to admin
"""
def process_reload_payment_success(request, reload_order, amount):
    print "Process reload payment success"
    try:
        # Amount Divisoon for 100 because vnpay return amount * 100
        amount = float(amount)/100

        print "VNPAY amount:: %s , Helio Amount:: %s" % (amount, reload_order.payment_amount)

        if amount != reload_order.payment_amount:
            reason = "Amount Not Match"
            reload_error_handle(request, reload_order, amount, reason)
        else:
            result = call_api_reload_to_card_barcode(reload_order)

            if result['code'] == 200:
                data = result['data']
                # Get phone and email recieved to send sms and email.
                reload_sucess_handle(request, reload_order, data['email'], data['phone'], data['cash_balance'])
            else:
                reason = 'Call DMZ '
                if result['code'] == 400:
                    reason = result['message']
                reload_error_handle(request, reload_order, amount, reason)

    except Exception, e:
        print('process_realod_payment_success: %s', traceback.format_exc())
        




