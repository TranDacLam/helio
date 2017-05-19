from django import forms
from models import Contact
import api.utils as utils

class ContactForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput())
    email = forms.CharField(widget=forms.TextInput())
    phone = forms.CharField(widget=forms.TextInput())
    subject = forms.CharField(widget=forms.TextInput())
    message = forms.CharField(widget=forms.TextInput())

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(ContactForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        name = self.cleaned_data['name']
        email = self.cleaned_data['email']
        phone = self.cleaned_data['phone']
        subject = self.cleaned_data['subject']
        message = self.cleaned_data['message']
        print "name11: ", name
        print commit

        if commit:
            try:
            	contact = Contact()
            	contact.name = name
                contact.email = email
                contact.phone = phone
                contact.subject = subject
                contact.message = message
                contact.save()

                message_plain = "websites/email/contact_email.txt"
                message_html = "websites/email/contact_email.html"

                data_render = {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "subject": subject,
                    "message": message
                    
                }

                utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, email_from=email, email_to=[email], data=data_render)
            except Exception, e:
                print 'Error ', e
    