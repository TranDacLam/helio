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