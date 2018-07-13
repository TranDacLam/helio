import urllib

from datetime import datetime
import time
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from django.core.serializers import json
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from rest_framework.response import Response
from api_vnpay.forms import ReloadPaymentForm
from api_vnpay.vnpay import vnpay
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
import traceback
from models import *
import actions
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes((AllowAny,))
def payment(request):
    print "Payment:::Init URL Vnpay"
    try:
        # Process input data and build url payment
        form = ReloadPaymentForm(request.data)
        if form.is_valid():
            # Get time unique to set for order id
            unique_time = time.mktime(datetime.now().timetuple())*1e3 + datetime.now().microsecond/1e3
            order_id = int(unique_time)
            print "order_id::", order_id
            # While order not unique then created orther order id
            while ReloadInfomation.objects.filter(order_id=order_id).exists():
                # Get time unique to set for order id
                unique_time = time.mktime(datetime.now().timetuple())*1e3 + datetime.now().microsecond/1e3
                order_id = int(unique_time)
                print "order_id created::", order_id

            barcode = form.cleaned_data['barcode']
            result_verify = actions.call_api_vefiry_card_barcode(barcode)
            print "result_verify::::", result_verify

            if result_verify['code'] != 200:
                return JsonResponse(result_verify, status = result_verify['code'])

            amount = form.cleaned_data['amount']
            fee = form.cleaned_data['fee']
            order_desc = form.cleaned_data['order_desc']
            bank_code = form.cleaned_data['bank_code']
            ipaddr = get_client_ip(request)

            # Payment amount = reload amount + fee
            payment_amount = amount + fee

            # Build URL Payment
            vnp = vnpay()
            vnp.requestData['vnp_Version'] = '2.0.0'
            vnp.requestData['vnp_Command'] = 'pay'
            vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
            vnp.requestData['vnp_Amount'] = payment_amount * 100
            vnp.requestData['vnp_CurrCode'] = 'VND'
            vnp.requestData['vnp_TxnRef'] = order_id
            vnp.requestData['vnp_OrderInfo'] = order_desc
            vnp.requestData['vnp_OrderType'] = settings.VNPAY_ORDER_TYPE
            # Check language, default: vn
            vnp.requestData['vnp_Locale'] = 'vn'

            # Check bank_code, if bank_code is empty, customer will be selected bank on VNPAY
            if bank_code and bank_code != "":
                vnp.requestData['vnp_BankCode'] = bank_code

            vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')  # 20150410063022
            vnp.requestData['vnp_IpAddr'] = ipaddr
            vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
            vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
            
            print "vnpay_payment_url::", vnpay_payment_url

            phone = form.cleaned_data['phone']
            full_name = form.cleaned_data['full_name']
            email = form.cleaned_data['email']
           
            
            # Store order infomation with status is pendding
            reload_order = ReloadInfomation(order_id=order_id, order_desc=order_desc, amount=amount, phone=phone,
                                              email=email, full_name=full_name, barcode=barcode, payment_amount=payment_amount,
                                              order_status="pendding", fee=fee)

            if not request.user.is_anonymous():
                reload_order.user = request.user
            reload_order.save()

            return JsonResponse({'code': '00', 'Message': 'Init Success', 'data': vnpay_payment_url})
            
        else:
            print "Form input not validate", form.errors
            error = {
                "code": 400, "message": _("Form input not validate"), "fields": ""}
            return Response(error, status=400)
    except Exception, e:
        print "PAYMENT error::: ", traceback.format_exc()
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


def payment_ipn(request):
    inputData = request.GET
    if inputData:
        vnp = vnpay()
        vnp.responseData = inputData.dict()
        order_id = inputData['vnp_TxnRef']
        amount = inputData['vnp_Amount']
        order_desc = inputData['vnp_OrderInfo']
        vnp_TransactionNo = inputData['vnp_TransactionNo']
        vnp_ResponseCode = inputData['vnp_ResponseCode']
        vnp_TmnCode = inputData['vnp_TmnCode']
        vnp_PayDate = inputData['vnp_PayDate']
        vnp_BankCode = inputData['vnp_BankCode']
        vnp_CardType = inputData['vnp_CardType']
        if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
            # Check & Update Order Status in your Database
            # Your code here

            # Check & Update Order Status in your Database
            try:
                """ 
                    get reload order verify with vnpayment 
                    step 1: get reload order by id, 
                            return code 00 if process successfully. 
                            return code 01 if order_id not found. 
                            return code 02 if order have been process before.
                            return code 99 if process reload movie error.
                    step 2: Call Api Confirm Booking and send sms or email if success
                    Step 3: Handle payment process error
                """
                reload_order = ReloadInfomation.objects.get(
                    order_id=order_id)

                # Verify Order_id proccess update before
                if reload_order.order_status == 'done':
                    return JsonResponse({'RspCode': '02', 'Message': 'Order Already Update'})

                # Save translation no to db to debugs
                reload_order.transaction_no = vnp_TransactionNo
                reload_order.save()

                if vnp_ResponseCode == '00':
                    # handle confirm reload and send sms , email
                    actions.process_reload_payment_success(request, reload_order, amount)
                    
                    # Return VNPAY: Merchant update success
                    result = JsonResponse(
                        {'RspCode': '00', 'Message': 'Confirm Success'})
                else:
                    print('Payment Error. Processing Payment Error', vnp_ResponseCode)

                    reload_order.order_status = 'payment_error'
                    reload_order.save()
                    # RspCode == 00 or 02 then cancel recall IPN
                    result = JsonResponse(
                        {'RspCode': '00', 'Message': 'Confirm Error'})

            except ReloadInfomation.DoesNotExist, e:
                print "Error ReloadInfomation DoesNotExist : %s" % e
                return JsonResponse(
                    {'RspCode': '01', 'Message': 'Order_id Not Found'})

        else:
            print "Translation OrderId: %s Invalid Signature with response code: %s" % (order_id, vnp_ResponseCode)
            # Invalid Signature
            result = JsonResponse({'RspCode': '97', 'Message': 'Invalid Signature'})
    else:
        result = JsonResponse({'RspCode': '99', 'Message': 'Invalid request'})

    return result


def payment_return(request):
    print "VNPay return"
    inputData = request.GET
    if inputData:
        vnp = vnpay()
        vnp.responseData = inputData.dict()
        order_id = inputData['vnp_TxnRef']
        amount = int(inputData['vnp_Amount']) / 100
        order_desc = inputData['vnp_OrderInfo']
        vnp_TransactionNo = inputData['vnp_TransactionNo']
        vnp_ResponseCode = inputData['vnp_ResponseCode']
        vnp_TmnCode = inputData['vnp_TmnCode']
        vnp_PayDate = inputData['vnp_PayDate']
        vnp_BankCode = inputData['vnp_BankCode']
        vnp_CardType = inputData['vnp_CardType']
        if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
            if vnp_ResponseCode == "00":
                return render(request, "websites/vnpay/payment_return.html", {"title": "Payment Result",
                                                               "result": _("Success"), "order_id": order_id,
                                                               "amount": amount,
                                                               "order_desc": order_desc,
                                                               "vnp_TransactionNo": vnp_TransactionNo,
                                                               "vnp_ResponseCode": vnp_ResponseCode})
            else:
                return render(request, "websites/vnpay/payment_return.html", {"title": "Payment Resutl",
                                                               "result": _("Error"), "order_id": order_id,
                                                               "amount": amount,
                                                               "order_desc": order_desc,
                                                               "vnp_TransactionNo": vnp_TransactionNo,
                                                               "vnp_ResponseCode": vnp_ResponseCode})
        else:
            return render(request, "websites/vnpay/payment_return.html",
                          {"title": "Payment Result", "result": _("Error"), "order_id": order_id, "amount": amount,
                           "order_desc": order_desc, "vnp_TransactionNo": vnp_TransactionNo,
                           "vnp_ResponseCode": vnp_ResponseCode, "msg": "Sai checksum"})
    else:
        return render(request, "websites/vnpay/payment_return.html", {"title": "Payment Result", "result": ""})


def query(request):
    if request.method == 'GET':
        return render(request, "websites/vnpay/query.html", {"title": "Kiem tra giao dich"})
    else:
        # Add paramter
        vnp = vnpay()
        vnp.requestData = {}
        vnp.requestData['vnp_Command'] = 'querydr'
        vnp.requestData['vnp_Version'] = '2.0.0'
        vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
        vnp.requestData['vnp_TxnRef'] = request.POST['order_id']
        vnp.requestData['vnp_OrderInfo'] = 'Kiem tra ket qua GD OrderId:' + request.POST['order_id']
        vnp.requestData['vnp_TransDate'] = request.POST['trans_date']  # 20150410063022
        vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')  # 20150410063022
        vnp.requestData['vnp_IpAddr'] = get_client_ip(request)
        requestUrl = vnp.get_payment_url(settings.VNPAY_API_URL, settings.VNPAY_HASH_SECRET_KEY)
        responseData = urllib.urlopen(requestUrl).read().decode()
        print('RequestURL:' + requestUrl)
        print('VNPAY Response:' + responseData)
        data = responseData.split('&')
        for x in data:
            tmp = x.split('=')
            if len(tmp) == 2:
                vnp.responseData[tmp[0]] = urllib.unquote(tmp[1]).replace('+', ' ')

        print('Validate data from VNPAY:' + str(vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY)))
        return render(request, "query.html", {"title": "kiem tra ket qua giao dich", "data": vnp.responseData})


def refund(request):
    return render(request, "websites/vnpay/refund.html", {"title": "Gui yeu cau hoan tien"})


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
