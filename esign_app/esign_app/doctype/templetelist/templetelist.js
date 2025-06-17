// Copyright (c) 2024, sbhosale@dexciss.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("TempleteList", {
	refresh(frm) {
        frm.set_query("doctype_name","for_doctypes", function() {
			return {
				filters: {
					istable: 0,
				}
			};
		});
	},
});
