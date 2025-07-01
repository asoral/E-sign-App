import json 
import base64
import frappe
import io
import subprocess
import string
import random
from io import BytesIO
import base64

from frappe.core.doctype.communication.email import make
from frappe.utils import get_datetime, get_url
from frappe.model.meta import get_meta

from datetime import datetime , timedelta
from OpenSSL import crypto
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from bs4 import BeautifulSoup



import tempfile
import os
from io import BytesIO
from pyhanko.sign import signers
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter


def generate_random_string():
    random_part = ''.join(random.choices(string.ascii_letters + string.digits, k=11))
    return f"Signature_Eisgn_{random_part}"


# Fetch All non Child Doctypes 
@frappe.whitelist(allow_guest=True) 
def get_all_non_child_doctypes():
    """
    Returns a list of all non-child (is_table = 0) doctypes.
    """
    all_doctypes = frappe.get_all("DocType", filters={"issingle": 0}, fields=["name"])
    
    non_child_doctypes = []
    for dt in all_doctypes:
        meta = get_meta(dt.name)
        if not meta.istable:
            non_child_doctypes.append(dt.name)
    
    return non_child_doctypes

# ++++ PDF Doc Creation and signing +++++++++++++++
@frappe.whitelist(allow_guest=True)  # Expose as a Frappe API
def generate_signed_pdf(components, pages, private_key_pem, certificate_pem):
    """
    Generate and sign a PDF using components, pages, and certificates.
    """
    print("inside generate_signed_pdf ")
    try:
        def base64_to_pdf(base64_str):
            """Convert base64 string to binary PDF data."""
            print("\n\n\n-------------> base64ToPDF : " + base64.b64encode(base64_str))
            return base64.b64decode(base64_str)

        def add_components_to_page(pdf_writer, page, components):
            """Add components to a given page."""
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=letter)
            print("\n\n\n-------------> inside add components to page")
            for component in components:
                pos = component["position"]
                top = pos["top"]
                left = pos["left"]

                if component["type"] == "text":
                    can.setFont("Helvetica", component.get("fontSize", 12))
                    can.drawString(left, letter[1] - top, component["content"])

            can.save()
            packet.seek(0)

            # Overlay the canvas onto the page
            overlay_pdf = PdfReader(packet)
            overlay_page = overlay_pdf.pages[0]
            page.merge_page(overlay_page)
            print("\n\n\n-------------> Completed add component to page ")
            pdf_writer.add_page(page)

        def merge_pdfs_with_components(pages, components):
            """Merge PDFs with components."""
            pdf_writer = PdfWriter()
            component_map = {int(comp["pageNo"]): [] for comp in components}
            print("\n\n\n-------------> components " , component_map)
            # print("\n\n\n-------------> page_data " , page_data)
            for comp in components:
                component_map[int(comp["pageNo"])].append(comp)

            for page_data in pages:
                pdf_bytes = base64_to_pdf(page_data["data"])
                reader = PdfReader(io.BytesIO(pdf_bytes))
                for page_no, page in enumerate(reader.pages, start=1):
                    comps = component_map.get(page_no, [])
                    add_components_to_page(pdf_writer, page, comps)

            output_pdf = io.BytesIO()
            print("\n\n\n-------------> Output Data : " , output_pdf)
            pdf_writer.write(output_pdf)
            return output_pdf.getvalue()

        def sign_pdf(pdf_data, private_key_pem, certificate_pem):
            """Digitally sign a PDF."""
            timestamp = datetime.now().isoformat()
            signed_pdf = io.BytesIO()

            print("______________> Signed PDF in sign pdf function", signed_pdf)
            # Load private key and certificate
            private_key = crypto.load_privatekey(crypto.FILETYPE_PEM, private_key_pem)
            certificate = crypto.load_certificate(crypto.FILETYPE_PEM, certificate_pem)

            print('\n\n\n+++++++++++++++++++++ Private Key :', private_key)
            print('\n\n\n+++++++++++++++++++++ Certificate :', certificate)

            # Sign the PDF
            writer = PdfWriter()
            reader = PdfReader(io.BytesIO(pdf_data))

            for page in reader.pages:
                writer.add_page(page)

            writer.add_metadata({
                "Author": "Frappe Service",
                "Title": "Digitally Signed PDF",
                "Subject": "Signed Document",
                "Producer": "PDF Generator",
                "CreationDate": timestamp
            })

            # Add signature field
            writer.write(signed_pdf)
            return signed_pdf.getvalue()

        # Parse input
        components = frappe.parse_json(components)
        pages = frappe.parse_json(pages)
        print("\n\n\n-------------> pages main function " , pages)
        print("\n\n\n-------------> components main function" , components)
        # Merge the PDFs with components
        merged_pdf = merge_pdfs_with_components(pages, components)

        # Digitally sign the merged PDF
        signed_pdf = sign_pdf(merged_pdf, private_key_pem, certificate_pem)
        print('\n\n\n================================ signed pdf', sign_pdf)
        # Return signed PDF as base64
        signed_pdf_base64 = base64.b64encode(signed_pdf).decode()
        print('\n\n\n================================ signed pdf 64 base :', signed_pdf_base64)
        return {"signed_pdf": signed_pdf_base64}

    except Exception as e:
        print('\n\n\n================================ error', e)
        frappe.log_error(f"Error in generate_signed_pdf: {str(e)}")
        return {"error": str(e)}


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


# ++++ Fetch OpenSSL List ++++++++++++
@frappe.whitelist(allow_guest=True)
def get_openssl_list(user_mail):
    try:
        openssl_list = frappe.get_all(
            'openssl',
            filters={'owner_email': user_mail},
            fields=['name','openssl_name','country']
        )
        return {'status': 200, 'data': openssl_list}
    except Exception as e:
        return {'status': 500, 'message': str(e)}


# Signature API's_______________________________________________________________________________________________________________________________________________

# ++++ OpenSSL List ++++++++++++



# ++++ Save Signature and SSL ++++++++++++

def run_command(command):
    """Execute a shell command and capture the output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running command: {command}")
        print(result.stderr)
        return None
    return result.stdout.strip()

def generate_private_key():
    """Generate a private key"""
    command = "openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048"
    run_command(command)
    with open("key.pem", "r") as f:
        private_key = f.read()
    return private_key

def generate_openssl_conf(C, ST, L, O, CN):
    """Generate openssl.conf content."""
    openssl_conf = f"""
[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
x509_extensions     = v3_req
prompt              = no

[ req_distinguished_name ]
C  = {C}
ST = {ST}
L  = {L}
O  = {O}
CN = {CN}

[ v3_req ]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth, emailProtection, codeSigning
"""
    return openssl_conf

def generate_self_signed_cert():
    """Generate a self-signed certificate"""
    command = "openssl req -x509 -new -key key.pem -out cert.pem -days 365 -config openssl.conf"
    run_command(command)
    with open("cert.pem", "r") as f:
        cert = f.read()
    return cert

def generate_ca_key():
    """Generate CA private key"""
    command = "openssl genpkey -algorithm RSA -out ca_key.pem -pkeyopt rsa_keygen_bits:2048"
    run_command(command)
    with open("ca_key.pem", "r") as f:
        ca_private_key = f.read()
    return ca_private_key

def generate_ca_cert(C, ST, L, O, CN, email):
    """Generate CA certificate"""
    command = f"openssl req -x509 -new -nodes -key ca_key.pem -sha256 -days 1024 -out ca_cert.pem -subj '/C={C}/ST={ST}/L={L}/O={O}/CN={CN}/emailAddress={email}'"
    run_command(command)
    with open("ca_cert.pem", "r") as f:
        ca_cert = f.read()
    return ca_cert

def generate_csr(C, ST, L, O, CN, email):
    """Generate CSR"""
    command = f"openssl req -new -key key.pem -out csr.pem -subj '/C={C}/ST={ST}/L={L}/O={O}/CN={CN}/emailAddress={email}'"
    run_command(command)
    with open("csr.pem", "r") as f:
        csr = f.read()
    return csr

def sign_csr_with_ca():
    """Sign CSR with the CA"""
    command = "openssl x509 -req -in csr.pem -CA ca_cert.pem -CAkey ca_key.pem -CAcreateserial -out cert.pem -days 365 -sha256"
    run_command(command)
    with open("cert.pem", "r") as f:
        signed_cert = f.read()
    return signed_cert

# Save Keys
def save_temp_files_to_variables():
    """Save the content of temporary files to variables."""
    temp_files = ["key.pem", "ca_key.pem", "ca_cert.pem", "cert.pem", "csr.pem", "openssl.conf"]
    
    # Dictionary to hold file contents
    file_contents = {}
    
    for file in temp_files:
        try:
            with open(file, "r") as f:
                file_contents[file] = f.read()  # Read file content and save it in the dictionary
        except FileNotFoundError:
            file_contents[file] = None  
    
    # Create separate variables for each file content
    key_pem = file_contents["key.pem"]
    ca_key_pem = file_contents["ca_key.pem"]
    ca_cert_pem = file_contents["ca_cert.pem"]
    cert_pem = file_contents["cert.pem"]
    csr_pem = file_contents["csr.pem"]
    openssl_conf = file_contents["openssl.conf"]
    
    # Return the variables as a dictionary for easy access
    return {
        "key_pem": key_pem,
        "ca_key_pem": ca_key_pem,
        "ca_cert_pem": ca_cert_pem,
        "cert_pem": cert_pem,
        "csr_pem": csr_pem,
        "openssl_conf": openssl_conf,
    }

def cleanup_temp_files():
    """Remove temporary files used for signing."""
    temp_files = ["key.pem", "ca_key.pem", "ca_cert.pem", "cert.pem", "csr.pem", "openssl.conf"]
    
    file_data = save_temp_files_to_variables()
    for var_name, content in file_data.items():
        print(f"Content of {var_name}:")
        print(content)

    for file in temp_files:
        command = f"rm -f {file}"  # -f ensures no error is raised if the file doesn't exist
        run_command(command)

@frappe.whitelist(allow_guest=True)
def genrate_and_store_keys(country,state,location,organization,challenge_password,countryCode,username,email,openssl_name):
    try:
        C = countryCode
        ST = state
        L = location
        O = organization
        CN = username
        eml = email
        # challenge_password = "Pass123" 
        generate_private_key()
        # Step 2: Generate openssl.conf data
        openssl_conf_content = generate_openssl_conf(C, ST, L, O, CN)
        print("Generated openssl.conf content:\n", openssl_conf_content)
        # Save the openssl.conf content to a file
        with open("openssl.conf", "w") as f:
            f.write(openssl_conf_content)
        # Step 3: Generate the self-signed certificate
        generate_self_signed_cert()
        # Step 4: Generate CA private key
        generate_ca_key()
        # Step 5: Generate CA certificate
        generate_ca_cert(C, ST, L, O, CN, eml)
        # Step 6: Generate CSR
        generate_csr(C, ST, L, O, CN, eml)
        # Step 7: Sign the CSR with the CA
        sign_csr_with_ca()
        # Step 8: Regenerate self-signed cert (if needed)
        generate_self_signed_cert()
        # cleanup_temp_files()
        file_data = save_temp_files_to_variables()
        for var_name, content in file_data.items():
            print(f"Content of {var_name}:")
            print(content)
        
        print('\n+++++++++++++++++++++++++++++++++++++####')
        # print('data ::::', file_data)
        print('key_pem:', file_data["key_pem"])
        print('ca_cert_pem:', file_data["ca_cert_pem"])
        print('csr_pem:', file_data["csr_pem"])
        print('owner_email:', email)
        print('ca_key_pem:', file_data["ca_key_pem"])
        print('cert_pem:', file_data["cert_pem"])
        print('openssl_conf:', file_data["openssl_conf"])
        print('+++++++++++++++++++++++++++++++++++++\n')
        UTC_time = datetime.utcnow().strftime('%Y%m%d%H%M%SZ')
        openssl_name_with_timestamp = f"{openssl_name}_{UTC_time}"
        doc1 = frappe.get_doc({
            'doctype': 'openssl_keys',
            'openssl_name': openssl_name_with_timestamp,
            'username': username,
            'key_pem': file_data["key_pem"],  
            'ca_cert_pem': file_data["ca_cert_pem"],
            'csr_pem': file_data["csr_pem"],
            'owner_email': email,
            'ca_key_pem': file_data["ca_key_pem"],
            'cert_pem': file_data["cert_pem"],
            'openssl_conf': file_data["openssl_conf"],
            })

        doc1.save()

        doc = frappe.get_doc({
            'doctype': 'openssl',
            'country': country,
            'country_code': countryCode,
            'state': state,
            'challenge_password': challenge_password,
            'city': location,
            'organization': organization,
            'username': username,
            'openssl_keys': '',
            'owner_email': email,
            'openssl_name': openssl_name_with_timestamp
        })
        doc.save()

      

        return {'status': 200, 'message': 'SSL saved successfully'}
    except Exception as e:
        print("Exception:", e)
        return {'status': 500, 'message': str(e) }

@frappe.whitelist(allow_guest=True)
def save_signature(
    signature_data, signature_name, user_full_name, user_email,openssl_name,expiry_date
    
):
    try:
        # Generate RSA Key pair
        # Log document fields to ensure correct values
        # print(f"Saving document with user_mail: {user_email}, certificate size: {len(cert_base64)} bytes")

        doc = frappe.get_doc({
            'doctype': 'Esign_signature',
            'sign_blob': signature_data,
            'sign_name': signature_name,
            'user_name': user_full_name,
            'user_mail': user_email,
            'expiry_date':expiry_date,
            'openssl_name':openssl_name
        })

        # Ensure no null values or unexpected types are present
        # print("Before saving the document: ", doc.as_dict())

        doc.save()
        doc.submit()

        return {'status': 200, 'message': 'Signature saved successfully'}
    except Exception as e:
        print("Exception:", e)
        return {'status': 500, 'message': str(e)}


# ++++ Get Signature ++++++++++++
@frappe.whitelist(allow_guest=True)
def get_signatures(user_mail):
    try:
        signatures = frappe.get_all(
            'Esign_signature',
            filters={'user_mail': user_mail},
            fields=['name', 'sign_blob', 'sign_name', 'user_mail', 'user_name', 'creation','openssl_name']
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
        templetes_list = frappe.db.sql("""
            SELECT name, is_public, templete_title, templete_owner_email, templete_owner_name, templete_created_at, is_public
            FROM `tabTempleteList`
            WHERE templete_owner_email = %s OR is_public = 1
        """, (user_mail), as_dict=True)

        return {'status': 200, 'data': templetes_list}

    except Exception as e:
        return {'status': 500, 'message': str(e)}

@frappe.whitelist(allow_guest=True)
def get_templetes_for_doctype(user_mail, requesting_doctype):
    try:
        templetes_list = frappe.db.sql("""
            SELECT DISTINCT t.name, t.is_public, t.templete_title, 
                            t.templete_owner_email, t.templete_owner_name, 
                            t.templete_created_at
            FROM `tabTempleteList` t
            LEFT JOIN `tabTemplate Selected Doctypes` fd ON fd.parent = t.name
            WHERE (
                t.is_public = 1 AND fd.doctype_name = %s
                OR (
                    t.is_public = 0 
                    AND t.templete_owner_email = %s
                    AND fd.doctype_name = %s
                )
            )
        """, (requesting_doctype, user_mail, requesting_doctype), as_dict=True)

        return {'status': 200, 'data': templetes_list}

    except Exception as e:
        return {'status': 500, 'message': str(e)}

# ++++ Get Templete End +++++++++++++++++++++++

@frappe.whitelist(allow_guest=True)
def get_templetes_fixstatus(name):
    try:
        fix_status = frappe.get_all(
            'TempleteList',
            filters={'name': name},
            fields=['use_default_base_pdf']
        )
        return {'status': 200, 'data': fix_status}
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
def update_template(templete_name, templete_json_data, base_pdf_data, use_default_base_pdf, isPublic, selectedDoctypes=None):
    try:
        templete_json_data = json.loads(templete_json_data)
        base_pdf_data = json.loads(base_pdf_data)

        if selectedDoctypes:
            selectedDoctypes = selectedDoctypes
        else:
            selectedDoctypes = []

        doc = frappe.get_doc("TempleteList", templete_name)
        doc.templete_json_data = templete_json_data
        doc.base_pdf_data = base_pdf_data
        doc.use_default_base_pdf = use_default_base_pdf
        doc.is_public = isPublic
        doc.set("for_doctypes", [])
        # Append to child table without clearing existing entries
        for doctype in selectedDoctypes:
            doc.append("for_doctypes", {
                "doctype_name": doctype
            })

        doc.save()
        return {'status': 200, 'message': 'Template Updated successfully'}

    except Exception as e:
        return {'status': 500, 'message': str(e)}
# ++++ Save/Update Template End ++++++++++++


# Get JSON templete Data --- components +++++++++++++
@frappe.whitelist(allow_guest=True)
def get_template_json(templete_name):
    try:

        doc = frappe.get_doc("TempleteList", templete_name)
        selected_doctypes = [row.doctype_name for row in doc.for_doctypes]
        response = {
            'status': 200,
            'templete_json_data': doc.templete_json_data,
            'base_pdf_data': doc.base_pdf_data,
            'use_default_base_pdf' : doc.use_default_base_pdf,
            'is_public': doc.is_public,
            'selected_doctypes': selected_doctypes
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
def save_template_document(templete_name, document_name, user_email,manual_data_pdf,isFixedPdf):
    try:
        template_data = get_template_data(templete_name)
        if isFixedPdf == 1:
            base_pdf_data = template_data['base_pdf_data']
        else:
            base_pdf_data = json.dumps(manual_data_pdf)

        document_data = {
            'doctype': 'DocumentList', 
            'document_title': document_name,
            'template_title': templete_name,
            'owner_email': user_email,
            'document_json_data': template_data['templete_json_data'],
            'base_pdf_datad': base_pdf_data,
            'document_created_at': datetime.now()
        }
        document_doc = frappe.get_doc(document_data)
        document_doc.insert()
        new_document = frappe.get_value('DocumentList', document_doc.name,['name', 'document_title', 'template_title', 'owner_email', 'document_created_at', 'isnoteditable'], as_dict=True)

        return {'status': 200, 'message': 'Template and Document created successfully', 'data': new_document}
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
            filters={'owner_email': user_mail , 'isnoteditable': 0 },
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
def send_document_data(to, subject, body, document_name, user_mail, isChecked=True, mailUsers=None):
    try:
        doc = frappe.get_doc("DocumentList", document_name)
        
        doc.assigned_users = to
        doc.document_status_mail = mailUsers
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
        emb_message = f"Dear User,<br><br>You Have been assigned to sign A Document by: <a href='{full_url}'>{full_url}</a> <div>Discription: {message}</div> <br><br>Thank you."
        emails = [entry["email"] for entry in to_users.values()]
        print(emails)
        frappe.sendmail(
            recipients=emails,
            subject=subject,
            message=emb_message
        )
    except Exception as e:
        print('Error-----------> URL',e)

# get List for User of Doc Assigned Fetch +++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
@frappe.whitelist(allow_guest=True)
def get_documents_by_user(user_mail):
    try:
        documents_list = frappe.get_all(
            'DocumentList',
            filters={'isnoteditable': 1, 'assigned_users': ['like', f'%{user_mail}%']},
            fields=['name', 'document_title', 'owner_email', 'document_created_at', 'assigned_users','isrejected']
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
            fields=['document_subject','name', 'document_title', 'owner_email', 'document_created_at', 'assigned_users', 'description' , 'isrejected','reject_reason','rejected_by']
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
            'iscompleted': document.iscompleted,
            'opensslusedlist': document.opensslusedlist,
            'isRejected': document.isrejected
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


def create_temp_file(content):
    """Create a temporary file with the given content and return its file path."""
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    with open(temp_file.name, 'w') as f:
        f.write(content)
    return temp_file.name

def load_signer_from_variables(key_data, cert_data, ca_data=None):
    """Load the signer using key, cert, and optional CA data from variables."""
    # Create temporary files for the key, certificate, and CA chain
    key_file = create_temp_file(key_data)
    cert_file = create_temp_file(cert_data)
    ca_file = create_temp_file(ca_data) if ca_data else None
    
    # Load the signer using the created temporary files
    signer = signers.SimpleSigner.load(
        key_file=key_file,
        cert_file=cert_file,
        ca_chain_files=(ca_file,) if ca_file else ()
    )

    # Cleanup the temporary files
    os.remove(key_file)
    os.remove(cert_file)
    if ca_file:
        os.remove(ca_file)
    
    return signer


# Finl Doc Confirmation 
@frappe.whitelist(allow_guest=True)
def submit_final_document(document_title,document_json_data,opensslusedlist):
    try:
        # Parse JSON data
        document_json_data1 = json.loads(document_json_data)
        Document_openSSLName1 = json.dumps(opensslusedlist)
        print("Document data __________________",document_json_data1)
        doc = frappe.get_doc("DocumentList", document_title)
        doc.document_json_data = document_json_data
        doc.opensslusedlist = Document_openSSLName1
        message = 'Document completed successfully'
        doc.save()
        return {'status': 200, 'message': message}
    
    except Exception as e:
        return {'status': 500, 'message': str(e)}


@frappe.whitelist(allow_guest=True)
def reject_final_document(document_title,document_reason,document_owner):
    try:
        # Parse JSON data
        doc = frappe.get_doc("DocumentList", document_title)
        # doc.document_json_data = document_json_data
        doc.reject_reason = document_reason
        doc.rejected_by = document_owner
        doc.isrejected = True
        message = 'Document reject successfully'
        doc.save()
        return {'status': 200, 'message': message}
    
    except Exception as e:
        return {'status': 500, 'message': str(e)}
    
# ++++ Save/Update Template End ++++++++++++
@frappe.whitelist(allow_guest=True)
def mergeAndPrintSave(document_title,validated_pdf):
    soup = BeautifulSoup(validated_pdf, "html.parser")
    beautified_html = soup.prettify() 
    print(beautified_html)
    try:
        doc = frappe.get_doc("DocumentList", document_title)
        doc.validated_pdf = beautified_html
        doc.ismerged = True
        doc.save()
        frappe.db.commit()
        return {'status': 200, 'message': 'Document saved successfully.'}
    except Exception as e:
        return {'status': 500, 'message': str(e)}


def get_merged_pdf_base64(document_name):
    try:
        # Fetching the document list
        Merged = frappe.get_all(
            'DocumentList',
            filters={'name': document_name},
            fields=['validated_pdf']
        )
        # Ensure the result is not empty and contains the expected field
        if Merged and isinstance(Merged, list) and 'validated_pdf' in Merged[0]:
            return Merged[0]['validated_pdf']  # Return only the base64 string

        # Return an error message if the structure is not as expected
        return None  # Or return a custom error message
    except Exception as e:
        # Handle and return the exception details
        return {'status': 500, 'message': str(e)}


def get_assigned_users_OPENSSL(document_name):
    try:
        # Fetching the document list
        OpenSSLList = frappe.get_all(
            'DocumentList',
            filters={'name': document_name},
            fields=['opensslusedlist']
        )

        # Extracting the list of OpenSSL data names
        if OpenSSLList:
            openssl_data_list = []
            for item in OpenSSLList:
                # Parsing the JSON string from the response
                openssl_used_list = json.loads(item['opensslusedlist'])
                
                # Extracting the entire 'name' and adding them to the result list
                for entry in openssl_used_list:
                    openssl_data_list.append(entry['name'])
            
            return openssl_data_list
        else:
            return []

    except Exception as e:
        # Handle and return the exception details
        return {'status': 500, 'message': str(e)}

def get_OpenSSL_Name(OpenSSlname):
    try:
        # Fetching the document list
        Name = frappe.get_all(
            'openssl',
            filters={'name': OpenSSlname},
            fields=['openssl_name']
        )
        openssl_name_value = Name[0]['openssl_name'] if Name else None
        OpenSSLKeys = get_OpenSSL_keys(openssl_name_value)
        return OpenSSLKeys  
    except Exception as e:
        # Handle and return the exception details
        return {'status': 500, 'message': str(e)}

def get_OpenSSL_keys(SSLname):
    try:
        OpenSSLKeys = frappe.get_all(
            'openssl_keys',
            filters={'openssl_name':SSLname},
            fields=['key_pem','cert_pem','ca_cert_pem']
        )
        return OpenSSLKeys  
    except Exception as e:
        # Handle and return the exception details
        return {'status': 500, 'message': str(e)}

def split_pdf(base64_pdf):
    """
    Splits a base64 encoded PDF into individual pages and returns an array of base64 strings for each page.
    
    :param base64_pdf: The base64 encoded PDF.
    :return: A list of dictionaries containing page numbers and base64 data.
    """
    try:
        # Decode the base64 PDF
        pdf_bytes = base64.b64decode(base64_pdf)
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
        page_count = len(pdf_reader.pages)

        # List to hold the split pages' base64 data
        pages_base64 = []

        for i in range(page_count):
            # Create a new PDF writer for the current page
            pdf_writer = PdfWriter()
            pdf_writer.add_page(pdf_reader.pages[i])

            # Write the single page PDF to a bytes buffer
            pdf_buffer = BytesIO()
            pdf_writer.write(pdf_buffer)
            pdf_buffer.seek(0)

            # Encode the single page PDF back to base64
            new_pdf_base64 = base64.b64encode(pdf_buffer.read()).decode('utf-8')

            # Append the page data to the list
            pages_base64.append({"page": i, "data": new_pdf_base64})

        return pages_base64

    except Exception as e:
        # Handle errors and return an empty list
        print(f"Error splitting PDF: {str(e)}")
        return []

def format_keys_data(keys_data_raw):
    keys = []
    certs = []
    ca_certs = []
    
    for data in keys_data_raw:
        keys.append(data['key_pem'])
        certs.append(data['cert_pem'])
        ca_certs.append(data['ca_cert_pem'])
    
    return "\n".join(keys).strip(), "\n".join(certs).strip(), "\n".join(ca_certs).strip()


def process_and_merge_pages(Merged_PDF_data):
    """
    Process and merge the pages from the provided base64 data.
    Returns the merged PDF buffer.
    """
    merged_pdf_buffer = BytesIO()
    writer = PdfWriter()

    try:
        for page_entry in Merged_PDF_data:
            page_number = page_entry.get("page")
            page_data_base64 = page_entry.get("data")

            if not page_data_base64:
                raise ValueError(f"Page {page_number} is missing base64 data.")

            # Decode the base64 data to binary PDF
            try:
                page_data = base64.b64decode(page_data_base64)
            except Exception as e:
                raise ValueError(f"Invalid base64 data for page {page_number}.") from e

            # Validate the page PDF
            try:
                page_reader = PdfReader(BytesIO(page_data))
                if len(page_reader.pages) != 1:
                    raise ValueError(f"Page {page_number} does not contain exactly one page.")
                writer.add_page(page_reader.pages[0])  # Add the page to the merged PDF
            except Exception as e:
                raise ValueError(f"Failed to process page {page_number}: {str(e)}") from e

        # Write all merged pages to a single PDF buffer
        writer.write(merged_pdf_buffer)
        merged_pdf_buffer.seek(0)

    except Exception as e:
        raise RuntimeError("Failed to merge and validate pages.") from e

    return merged_pdf_buffer


def sign_merged_pdf(merged_pdf_buffer, keys, certs, ca_certs):
    """
    Sign the merged PDF and return the signed PDF as a base64-encoded string.
    """
    try:
        signer = load_signer_from_variables(keys, certs, ca_certs)
    except Exception as e:
        raise RuntimeError("Failed to load signing credentials.") from e

    try:
        signed_pdf_buffer = BytesIO()
        reader = IncrementalPdfFileWriter(merged_pdf_buffer)

        random_string = generate_random_string()
        sig_meta = signers.PdfSignatureMetadata(field_name=random_string)

        # Sign the PDF and write the result to the buffer
        signers.sign_pdf(
            reader,
            signature_meta=sig_meta,
            signer=signer,
            output=signed_pdf_buffer
        )
        signed_pdf_buffer.seek(0)
    except Exception as e:
        raise RuntimeError("Failed to sign the PDF.") from e

    try:
        signed_pdf_base64 = base64.b64encode(signed_pdf_buffer.read()).decode("utf-8")
    except Exception as e:
        raise RuntimeError("Failed to encode the signed PDF to base64.") from e

    return signed_pdf_base64

@frappe.whitelist(allow_guest=True)
def generate_and_sign_pdf(document_name):
    """
    Validate, merge, and sign the provided base64-encoded pages,
    and return the signed PDF as a base64-encoded string with multiple signatures.
    """
    # Get the list of OpenSSL names
    SSL_list = get_assigned_users_OPENSSL(document_name)
    
    # Get the initial PDF data (the base un-signed document)
    Merged_PDF_data = split_pdf(get_merged_pdf_base64(document_name))
    
    # Process and merge the pages into a buffer
    merged_pdf_buffer = process_and_merge_pages(Merged_PDF_data)
    
    # Initialize the final signed PDF buffer (to keep adding signatures)
    signed_pdf_base64 = ''
    
    for OpenSSlname in SSL_list:
        # Fetch the keys, certs, and ca_certs for the current OpenSSL name
        print('Open SSL names: ', OpenSSlname)
        keys, certs, ca_certs = format_keys_data(get_OpenSSL_Name(OpenSSlname))
        
        # Sign the merged PDF using the current keys and certificates
        signed_pdf_base64 = sign_merged_pdf(merged_pdf_buffer, keys, certs, ca_certs)
        
        # Re-load the signed PDF into the buffer to retain all signatures
        signed_pdf_buffer = base64.b64decode(signed_pdf_base64)
        merged_pdf_buffer = BytesIO(signed_pdf_buffer)  # Reassign the buffer

    # Cleanup temporary files after all signatures have been applied
    cleanup_temp_files()

    # Return the final signed PDF base64 (which includes all signatures)
    return signed_pdf_base64



# @frappe.whitelist(allow_guest=True)
# def generate_and_sign_pdf(document_name):
#     """
#     Validate, merge, and sign the provided base64-encoded pages,
#     and return the signed PDF as a base64-encoded string.
#     """
#     OpenSSlname = 'openssl_data-0000000565-utctime-2025-01-20 14:58:00.167842'

#     SSL_list = get_assigned_users_OPENSSL(document_name)
#     Merged_PDF_data = split_pdf(get_merged_pdf_base64(document_name))

#     merged_pdf_buffer = process_and_merge_pages(Merged_PDF_data)
#     keys, certs, ca_certs = format_keys_data(get_OpenSSL_Name(OpenSSlname))

#     # Sign the merged PDF
#     signed_pdf_base64 = sign_merged_pdf(merged_pdf_buffer, keys, certs, ca_certs)
    

#     # Cleanup temporary files
#     cleanup_temp_files()

#     return signed_pdf_base64




# @frappe.whitelist(allow_guest=True)
# def generate_and_sign_pdf(document_name):
#     """
#     Validate, merge, and sign the provided base64-encoded pages, 
#     and return the signed PDF as a base64-encoded string.
#     """
#     # Validate and decode each page's base64 data
#     merged_pdf_buffer = BytesIO()
#     OpenSSlname = 'openssl_data-0000000565-utctime-2025-01-20 14:58:00.167842'
#     writer = PdfWriter()
#     Merged_PDF_data = split_pdf(get_merged_pdf_base64(document_name))
#     keys, certs, ca_certs = format_keys_data(get_OpenSSL_Name(OpenSSlname))


#     # print('-------------++++++++++++++++++++++++++++++++>',Merged_PDF_data)
#     try:
#         for page_entry in Merged_PDF_data:
#             page_number = page_entry.get("page")
#             page_data_base64 = page_entry.get("data")

#             if not page_data_base64:
#                 raise ValueError(f"Page {page_number} is missing base64 data.")

#             # Decode the base64 data to binary PDF
#             try:
#                 page_data = base64.b64decode(page_data_base64)
#             except Exception as e:
#                 raise ValueError(f"Invalid base64 data for page {page_number}.") from e

#             # Validate the page PDF
#             try:
#                 page_reader = PdfReader(BytesIO(page_data))
#                 if len(page_reader.pages) != 1:
#                     raise ValueError(f"Page {page_number} does not contain exactly one page.")
#                 writer.add_page(page_reader.pages[0])  # Add the page to the merged PDF
#             except Exception as e:
#                 raise ValueError(f"Failed to process page {page_number}: {str(e)}") from e

#         # Write all merged pages to a single PDF buffer
#         writer.write(merged_pdf_buffer)
#         merged_pdf_buffer.seek(0)
#     except Exception as e:
#         raise RuntimeError("Failed to merge and validate pages.") from e

#     # Load signing credentials
#     try:
#         signer = load_signer_from_variables(keys, certs, ca_certs)
#     except Exception as e:
#         raise RuntimeError("Failed to load signing credentials.",e) from e

#     # Sign the merged PDF
#     try:
#         signed_pdf_buffer = BytesIO()
#         reader = IncrementalPdfFileWriter(merged_pdf_buffer)
        
#         random_string = generate_random_string()
#         sig_meta = signers.PdfSignatureMetadata(field_name=random_string)

#         # Sign the PDF and write the result to the buffer
#         signers.sign_pdf(
#             reader,
#             signature_meta=sig_meta,
#             signer=signer,
#             output=signed_pdf_buffer
#         )
#         signed_pdf_buffer.seek(0)
#     except Exception as e:
#         raise RuntimeError("Failed to sign the PDF.") from e

#     # Encode the signed PDF to base64
#     try:
#         signed_pdf_base64 = base64.b64encode(signed_pdf_buffer.read()).decode("utf-8")
#     except Exception as e:
#         raise RuntimeError("Failed to encode the signed PDF to base64.") from e

#     # Cleanup temporary files
#     cleanup_temp_files()

#     return signed_pdf_base64


# ____________________________________________________________________________-

def return_to_data_list(updatedComponentData):
    """Generate recipient structure from updatedComponentData."""

    if isinstance(updatedComponentData, str):
        updatedComponentData = json.loads(updatedComponentData)

    recipient_dict = {}
    count = 0

    for component in updatedComponentData:
        emails = component.get("assign", [])
        for email in emails:
            if email:  # Skip empty strings
                recipient_dict[str(count)] = {
                    "email": email,
                    "status": "unseen"
                }
                count += 1

    return recipient_dict


@frappe.whitelist()
def create_updated_document(custom_docname, selectedValue, pdfBase64, email, updatedComponentData , assigned_users = {}):
    """Create document using updated component JSON data and PDF."""

    try:
        # Convert updatedComponentData from JSON string to Python list (in case it’s sent as JSON string)
        if isinstance(updatedComponentData, str):
            updatedComponentData2 = json.loads(updatedComponentData)
        print("\n\nUpdated Component Data:", updatedComponentData)
        print("\n\nUpdated Component Data2:", updatedComponentData2)
        print("\n\nAssigned Users:",assigned_users)

        # Process the PDF
        pdf_data = split_pdf(pdfBase64)

        # Create document record
        document_data = {
            'doctype': 'DocumentList', 
            'document_title': custom_docname,
            'template_title': selectedValue,
            'owner_email': email,
            'document_json_data': json.dumps(updatedComponentData2),
            'base_pdf_datad': json.dumps(pdf_data),
            'assigned_users' : json.dumps(assigned_users),
            'document_created_at': datetime.now()
        }

        document_doc = frappe.get_doc(document_data)
        document_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        
        to = assigned_users
        subject = f"New Document ({custom_docname} - {selectedValue}) - Action Required"
        body = f"""
                Hello,

                A new document titled *{custom_docname}* based on the template *{selectedValue}* has been shared with you.

                Please review and sign it at your earliest convenience.

                Regards,  
                Your Dexciss eSign System
                """
        document_name=document_doc.name
        print("------------------------------->",document_name)
        isChecked = False if not assigned_users else True
        send_document_data(to, subject, body, document_name, email, isChecked)
        return {"status": 200, "message": "Document Created Successfully"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Create Updated Document Error")
        return {"status": 500, "error": str(e)}


@frappe.whitelist()
def fetch_and_print_data(custom_docname, selectedValue, pdfBase64, email):
    """Fetch data using custom_docname and save document details."""

    try:
        # Process the PDF only once
        pdf_data = split_pdf(pdfBase64)

        # Fetch template data
        template_data = get_template_data(selectedValue)

        # Create document record
        document_data = {
            'doctype': 'DocumentList', 
            'document_title': custom_docname,
            'template_title': selectedValue,
            'owner_email': email,
            'document_json_data': template_data.get('templete_json_data', '[]'),
            'base_pdf_datad': json.dumps(pdf_data),
            'document_created_at': datetime.now()
        }
        
        # Insert into Frappe
        document_doc = frappe.get_doc(document_data)
        document_doc.insert(ignore_permissions=True)  # Ignore permissions to allow API inserts
        
        frappe.db.commit()  # Ensure changes are saved
        
        return {"status": 200, "message": "Document Created Successfully"}
    
    except Exception as e:
        frappe.log_error(f"Error in fetch_and_print_data: {str(e)}", "eSign App")
        return {"status": 500, "error": str(e)}

@frappe.whitelist(allow_guest=True)
def send_img_to_server(name,image_data,doc_name):
    """
    Save the image to the File DocType and return the file name.
    """
    if image_data:
        image_data1 = base64.b64decode(image_data.split(",")[1])  
        file_doc = frappe.get_doc({
            'doctype': 'File',
            'file_name': f"{name}_vehicle_image.jpg",  
            'file_url': f"/files/{name}_vehicle_image.jpg",  
            'content': image_data1
        })
        file_doc.save()
        frappe.db.set_value('File',file_doc.name,{
            'is_private': 1,
        })

        # Save the vehicle image URL
        # self.vehicle_image = f"/files/{self.name}_vehicle_image.jpg"
                    # 'attached_to_doctype' : 'Gate Entry',
            # 'attached_to_name' : doc_name

@frappe.whitelist(allow_guest=True)
def testAPI():
    return 'working api...'