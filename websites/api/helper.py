import json
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _

# Mapping result with code of dmz reponse
def code_mapping_error_dmz(status_code, json_data):
    print "json_data:::::::::"
    switcher = {
        200: json_data,
        401: {"code": 500, "message": _("Call API Unauthorized."), "fields": ""},
        400: {"code": 400, "message": _(json_data["message"]) if status_code==400 else json_data, "fields": ""}
    }
    return switcher.get(status_code, {"code": 500, "message": _("Call API error."), "fields": ""})

"""
    DMZ responde with:
    Case 1: 200 return data
    Case 2: 400 return data with message translate
    Else: Return erorr
"""
def dmz_response_process(response):
    # handle decoding json
    try:
        # convert response text to json
        json_data = response.json()
    except ValueError as e:
        print "Error convert json : %s" % e
        return Response({"code": 500, "message": _("Handle data error.")}, status=500)

    # Mapping status dmz reponse with reponse
    result = code_mapping_error_dmz(response.status_code, json_data)
    if response.status_code != 200 :
        print "DMZ Response Text:::", response.text
        return Response(result, status=result['code'])

    return Response(result, status=200)


def is_int(val):
    try:
        a = int(val)
        return True
    except ValueError:
        return False

def is_empty(val):
    if bool(val):
        return False
    else:
        return True
        
def check_id_valid(id):
    error = ""
    if is_empty(id):
        error = "This field is required"
    elif not is_int(id):
        error = "This value must be is integer."

    return error