frappe.provide("frappe.ui.form");

// Delay the overriding of FormTimeline class
setTimeout(() => {
    if (frappe.ui && frappe.ui.form && frappe.ui.form.FormTimeline) {
        console.log("FormTimeline is available. Proceeding with override.");

        // Overriding FormTimeline class
        frappe.ui.form.FormTimeline = class extends frappe.ui.form.FormTimeline {
            setup_timeline_actions() {
                console.log('Custom setup_timeline_actions triggered.');

                // Original "New Email" button
                this.add_action_button(
                    __("New Email"),
                    () => this.compose_mail(),
                    "es-line-add",
                    "btn-secondary"
                );

                // Custom "Send To eSign" button
                this.add_action_button(
                    __("Send To eSign"),
                    () => this.send_to_esign(),
                    "es-line-paper-plane",
                    "btn-primary"
                );

                // Call the original setup method to retain other actions
                this.setup_new_event_button();
            }

            send_to_esign() {
                console.log('Send To eSign clicked.');

                // API call to send the document to eSign
                frappe.call({
                    method: "path.to.your.api.method",  // Replace with your actual API endpoint
                    args: {
                        document_name: this.frm.doc.name, // Pass current document name
                    },
                    callback: function(response) {
                        if (!response.exc) {
                            frappe.msgprint(__("Document sent to eSign successfully!"));
                        } else {
                            frappe.msgprint(__("Failed to send document to eSign."));
                        }
                    },
                });
            }
        };

        console.log("FormTimeline class has been successfully overridden.");
    } else {
        console.error("FormTimeline is not yet available. Retrying...");
    }
}, 3000);  // Delay the override by 3 seconds (3000ms)
