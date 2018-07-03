from django import forms


class ReloadPaymentForm(forms.Form):
    amount = forms.IntegerField()
    order_desc = forms.CharField(max_length=100)
    bank_code = forms.CharField(max_length=20, required=False)
    phone = forms.CharField(max_length=20)
    email = forms.CharField(max_length=250)
    barcode = forms.CharField(max_length=50)
    full_name = forms.CharField(max_length=250)
    fee = forms.IntegerField()