def isInt(val):
    try:
        a = int(val)
        return True
    except ValueError:
        return False

def isEmpty(val):
    if bool(val):
        return False
    else:
        return True
        
def checkIdValid(id):
    error = ""
    if isEmpty(id):
        error = "This field is required"
    elif not isInt(id):
        error = "This value must be is integer."

    return error