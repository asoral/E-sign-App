# Copyright (c) 2024, sbhosale@dexciss.com and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document

class DocumentList(Document):
    def validate(self):
        self.handle_status_change()

    def handle_status_change(self):
        # Track if 'iscompleted' was just changed from False → True
        if self.is_new():
            previous_completed = False
        else:
            previous_completed = frappe.db.get_value(self.doctype, self.name, "iscompleted")

        just_marked_complete = not previous_completed and self.iscompleted

        if just_marked_complete:
            # Parse recipient emails from `document_status_mail` field
            try:
                recipients_json = self.document_status_mail or "{}"
                recipients = json.loads(recipients_json)
                email_list = [entry.get("email") for entry in recipients.values() if entry.get("email")]
                print("Email List -------------------------------------------->", email_list)
                if not email_list:
                    frappe.throw("No valid email addresses found in Document Status Mail.")

                # Generate document URL
                doc_url = frappe.utils.get_url_to_form(self.doctype, self.name)

                # Determine mail type based on isrejected
                if self.isrejected:
                    subject = f"Document '{self.name}' has been Rejected"
                    message = f"""
                        Dear User,<br><br>
                        The document <b>{self.name}</b> has been <span style='color:red'><b>rejected</b></span>.<br>
                        Please <a href="{doc_url}" target="_blank">click here</a> to review the rejection.<br><br>
                        Thank you.
                    """
                else:
                    subject = f"Document '{self.name}' is Completed"
                    message = f"""
                        Dear User,<br><br>
                        The document <b>{self.name}</b> has been marked as <span style='color:green'><b>completed</b></span>.<br>
                        Please <a href="{doc_url}" target="_blank">click here</a> to review it.<br><br>
                        Thank you.
                    """

                # Send the email
                frappe.sendmail(
                    recipients=email_list,
                    subject=subject,
                    message=message
                )

                # Make the field readonly by setting custom flag (optional)
                self.set_onload("make_iscompleted_readonly", True)

            except Exception as e:
                frappe.log_error(frappe.get_traceback(), "DocumentList Completion Mail Error")
                frappe.throw(f"Error sending completion/rejection email: {str(e)}")
