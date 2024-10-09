import frappe
from frappe.core.doctype.communication.email import make
from frappe.utils import get_datetime, get_url
import json 

from datetime import datetime
# ++++ Save or Create User ++++++++++++
@frappe.whitelist(allow_guest= True)
def create_user(fullName,password,email):
    try:
        doc = frappe.get_doc({'doctype':'User'})
        doc.email=email
        doc.first_name=fullName
        doc.full_name=fullName
        doc.username=fullName
        doc.new_password=password
        doc.role_profile_name="esign"
        doc.send_welcome_email=0
        doc.insert()
        print("try"*40)
        return {'status':200,'message':'User created successfully'}
    except Exception as e:
        print("exception"*30)
        return {'status':500,'message':str(e)}
# ++++ Save or Create User End ++++++++++++

# Signature API's_______________________________________________________________________________________________________________________________________________
# ++++ Save Signature ++++++++++++
@frappe.whitelist(allow_guest= True)
def save_signature(signature_data, signature_name, user_full_name, user_email):
    try:
        doc=frappe.get_doc({'doctype':'Esign_signature'})
        doc.sign_blob=signature_data
        doc.sign_name=signature_name
        doc.user_name=user_full_name
        doc.user_mail=user_email
        # doc.insert()
        doc.save()
        doc.submit()
        return {'status':200,'message':'Signature saved successfully'}
    except Exception as e:
        return {'status':500,'message':str(e)}
# ++++ Save Signature End ++++++++++++

# ++++ Get Signature ++++++++++++
@frappe.whitelist(allow_guest=True)
def get_signatures(user_mail):
    try:
        signatures = frappe.get_all(
            'Esign_signature',
            filters={'user_mail': user_mail},
            fields=['name', 'sign_blob', 'sign_name', 'user_mail', 'user_name', 'creation']
        )
        return {'status': 200, 'data': signatures}
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Get Signature End ++++++++++++

# ++++ Delete Sign ++++++++++++++++++
@frappe.whitelist()
def cancel_and_delete_esignature(user_mail, name):
    try:
        esignature = frappe.get_doc("Esign_signature", name)

        if esignature.user_mail == user_mail:
            esignature.cancel()

            esignature.delete()

            return {"status": 200, "message": "Esign_signature canceled and deleted successfully."}
        else:
            return {"status": 403, "message": "User mail does not match. Access denied."}

    except frappe.DoesNotExistError:
        return {"status": 404, "message": "Esign_signature document not found."}
    except Exception as e:
        return {"status": 500, "message": f"Error: {str(e)}"}


# Templete API's_______________________________________________________________________________________________________________________________________________
# ++++ Save Templete ++++++++++++
@frappe.whitelist(allow_guest=True)
def save_templete(templete_name, user_full_name, user_email):
    try:
        from datetime import datetime
        # Create a new document
        doc = frappe.get_doc({'doctype': 'TempleteList'})
        doc.templete_title = templete_name
        doc.templete_owner_name = user_full_name
        doc.templete_owner_email = user_email
        doc.templete_created_at = datetime.now()
        doc.save()
        
        # Fetch the saved template based on email
        templetes_list = frappe.get_all(
            'TempleteList',
            filters={'templete_owner_email': user_email , 'templete_title': templete_name },
            fields=['name', 'templete_title', 'templete_owner_email', 'templete_owner_name', 'templete_created_at']
        )
        
        # Return success response with data
        return {'status': 200, 'message': 'Templete Created successfully', 'data': templetes_list}
    except Exception as e:
        # Return error response with exception message
        return {'status': 500, 'message': str(e)}

# ++++ Save Templete End ++++++++++++
# ++++ Get Templete ++++++++++++
@frappe.whitelist(allow_guest=True)
def get_templetes(user_mail):
    try:
        templetes_list = frappe.get_all(
            'TempleteList',
            filters={'templete_owner_email': user_mail},
            fields=['name','templete_title', 'templete_owner_email', 'templete_owner_name', 'templete_created_at']
        )
        return {'status': 200, 'data': templetes_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Get Templete End ++++++++++++

#+++++ Delete Templete +++++++++++++++++
@frappe.whitelist()
def delete_esign_templete(user_mail, name):
    try:
        templeteList = frappe.get_doc("TempleteList", name)
        if templeteList.templete_owner_email == user_mail:
            templeteList.delete()

            return {"status": 200, "message": "Templete deleted successfully."}
        else:
            return {"status": 403, "message": "User mail does not match. Access denied."}

    except frappe.DoesNotExistError:
        return {"status": 404, "message": "Templete document not found."}
    except Exception as e:
        return {"status": 500, "message": f"Error: {str(e)}"}

# Templete APIs --------------------------------------------------------------------
# ++++ Update Template ++++++++++++
@frappe.whitelist(allow_guest=True)
def update_template(templete_name,templete_json_data, base_pdf_data):
    try:
        templete_json_data = json.loads(templete_json_data)
        base_pdf_data = json.loads(base_pdf_data)

        doc = frappe.get_doc("TempleteList", templete_name)
        doc.templete_json_data = templete_json_data
        doc.base_pdf_data = base_pdf_data
        message = 'Template Updated successfully'
        doc.save()
        return {'status': 200, 'message': message}
    
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Save/Update Template End ++++++++++++


# Get JSON templete Data --- components +++++++++++++
@frappe.whitelist(allow_guest=True)
def get_template_json(templete_name):
    try:

        doc = frappe.get_doc("TempleteList", templete_name)
        response = {
            'status': 200,
            'templete_json_data': doc.templete_json_data,
            'base_pdf_data': doc.base_pdf_data
        }
        return response

    except frappe.DoesNotExistError:
        return {'status': 404, 'message': 'Template not found'}
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# END================================================

# ================================= Document API =================================
# Fetch Template data 
@frappe.whitelist(allow_guest=True)
def get_templetes_list_doc(user_mail):
    try:
        templetes_list = frappe.get_all(
            'TempleteList',
            filters={'templete_owner_email': user_mail},
            fields=['name']
        )
        return {'status': 200, 'data': templetes_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}
#END================================================
# Save Document data
@frappe.whitelist(allow_guest=True)
def save_template_document(templete_name, document_name, user_email):
    try:
        template_data = get_template_data(templete_name)
        document_data = {
            'doctype': 'DocumentList', 
            'document_title': document_name,
            'template_title': templete_name,
            'owner_email': user_email,
            'document_json_data': template_data['templete_json_data'],
            'base_pdf_datad': template_data['base_pdf_data'],
            'document_created_at': datetime.now()
        }
        document_doc = frappe.get_doc(document_data)
        document_doc.insert()

        return {'status': 200, 'message': 'Template and Document created successfully'}
    except Exception as e:
        return {'status': 500, 'message': str(e)}
        
def get_template_data(templete_name):
    try:
        template_doc = frappe.get_doc('TempleteList', {'name': templete_name})
        return {
            'templete_json_data': template_doc.templete_json_data, 
            'base_pdf_data': template_doc.base_pdf_data
        }
    except frappe.DoesNotExistError:
        return {
            'templete_json_data': '',
            'base_pdf_data': ''
        }

#Document List Display ++++++++++++++++++++++++++++++++++++++++++++
# Get Documents 
@frappe.whitelist(allow_guest=True)
def get_documents_list(user_mail):
    try:
        document_list = frappe.get_all(
            'DocumentList',
            filters={'owner_email': user_mail , 'isnoteditable': 0},
            fields=['name','document_title', 'template_title', 'owner_email', 'document_created_at', 'isnoteditable']
        )
        return {'status': 200, 'data': document_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}

#+++++ Delete Templete +++++++++++++++++
@frappe.whitelist()
def delete_esign_document(user_mail, name):
    try:
        documentList = frappe.get_doc("DocumentList", name)
        if documentList.owner_email == user_mail:
            documentList.delete()
            return {"status": 200, "message": "Document deleted successfully."}
        else:
            return {"status": 403, "message": "User mail does not match. Access denied."}

    except frappe.DoesNotExistError:
        return {"status": 404, "message": "Document not found."}
    except Exception as e:
        return {"status": 500, "message": f"Error: {str(e)}"}

# ++++++ Get Document Components and BasePDF data +++++++++++++++
@frappe.whitelist(allow_guest=True)
def get_document_components_and_basepdf(document_name):
    try:
        doc = frappe.get_doc("DocumentList", document_name)
        response = {
            'status': 200,
            'document_json_data': doc.document_json_data,
            'base_pdf_datad': doc.base_pdf_datad,
            'assigned_users': doc.assigned_users,
            'iscompleted': doc.iscompleted,
        }
        return response

    except frappe.DoesNotExistError:
        return {'status': 404, 'message': 'Document not found'}
    except Exception as e:
        return {'status': 500, 'message': str(e)}

# update document State 
@frappe.whitelist(allow_guest=True)
def update_document(document_title,document_json_data, base_pdf_datad , assigned_user_list):
    try:
        # Parse JSON data
        document_json_data = json.loads(document_json_data)
        base_pdf_datad = json.loads(base_pdf_datad)
        assign_users = json.loads(assigned_user_list)
        
        doc = frappe.get_doc("DocumentList", document_title)

        doc.document_json_data = document_json_data
        doc.base_pdf_datad = base_pdf_datad
        doc.assigned_users = assign_users
        message = 'Document Updated successfully'
        doc.save()
        return {'status': 200, 'message': message}
    
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Save/Update Template End ++++++++++++

@frappe.whitelist(allow_guest=True)
def patch_user_status_document(document_title, assigned_user_list):
   
    try:
        assign_users = json.loads(assigned_user_list)
        doc = frappe.get_doc("DocumentList", document_title)
        doc.assigned_users = assign_users
        doc.save()
        message = 'Assigned users updated successfully'
        return {'status': 200, 'message': message}
    except Exception as e:
        return {'status': 500, 'message': str(e)}


# update document and assign to users [ Frezzee the document ]

@frappe.whitelist(allow_guest=True)
def send_document_data(to, subject, body, document_name, user_mail, isChecked):
    try:
        doc = frappe.get_doc("DocumentList", document_name)
        
        doc.assigned_users = to
        doc.document_subject = subject
        doc.description = body
        doc.user_mail = user_mail
        doc.isnoteditable = isChecked
        
        doc.save()
        send_url_email(to, subject ,body)

        return {'status': 200, 'message': 'Document Assigned Successfully'}
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "send_document_data")
        return {'status': 500, 'message': str(e)}
# End ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

def send_url_email(to, subject , message):
    to_users=json.loads(to)
    try: 
        full_url = f"http://192.168.10.189:8080/"
        emb_message = f"Dear User,<br><br>You Have been assigned to sign A Document by: <a href='{full_url}'>{full_url}</a><br><br>Thank you. <div>Discription: {message}</div>"
        emails = [entry["email"] for entry in to_users.values()]
        print(emails)
        frappe.sendmail(
            recipients=emails,
            subject=subject,
            message=emb_message
        )
    except Exception as e:
        print('Error-----------> URL',e)

# def test_send_url_email(to=["sbhosale@dexciss.com"], subject='GGGG', message='OP'):
#     try:
#         frappe.sendmail(
#             recipients=to,
#             subject=subject,
#             message=message
#         )
#         print('Email sent successfully')
#     except Exception as e:
#         print('Error-----------> URL', e)



# get List for User of Doc Assigned Fetch +++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
@frappe.whitelist(allow_guest=True)
def get_documents_by_user(user_mail):
    try:
        documents_list = frappe.get_all(
            'DocumentList',
            filters={'isnoteditable': 1, 'assigned_users': ['like', f'%{user_mail}%']},
            fields=['name', 'document_title', 'owner_email', 'document_created_at', 'assigned_users']
        )
        return {'status': 200, 'data': documents_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}

# get List for Sent Data Box +++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
@frappe.whitelist(allow_guest=True)
def sent_doc_by_user(user_mail):
    try:
        documents_list = frappe.get_all(
            'DocumentList',
            filters={'isnoteditable': 1, 'owner_email': user_mail},
            fields=['document_subject','name', 'document_title', 'owner_email', 'document_created_at', 'assigned_users', 'description' ]
        )
        return {'status': 200, 'data': documents_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}

# ___________________________________________________________Doc Status User Assign Update _______________________________________________________________________________________
@frappe.whitelist(allow_guest=True)
def get_assigned_users_list_check(user_document_name):
    try:
        document = frappe.get_doc('DocumentList', user_document_name)
        doc_data = {
            'assigned_users': document.assigned_users,
            'iscompleted': document.iscompleted
        }
        
        return {'status': 200, 'data': doc_data}
    except Exception as e:
        return {'status': 500, 'message': str(e)}


@frappe.whitelist(allow_guest=True)
def update_document_status_confirm(user_document_name):
    try:
        document = frappe.get_doc('DocumentList', user_document_name)
        document.iscompleted = True
        document.save()
        
        return {'status': 200, 'message': 'Document status updated successfully.'}
    except Exception as e:
        return {'status': 500, 'message': str(e)}


# Finl Doc Confirmation 
@frappe.whitelist(allow_guest=True)
def submit_final_document(document_title,document_json_data):
    try:
        # Parse JSON data
        document_json_data1 = json.loads(document_json_data)
        print("Document data __________________",document_json_data1)
        doc = frappe.get_doc("DocumentList", document_title)
        doc.document_json_data = document_json_data
     
        message = 'Document completed successfully'
        doc.save()
        return {'status': 200, 'message': message}
    
    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Save/Update Template End ++++++++++++