console.log("🔥 global_listview.js LOADED 3");

frappe.listview_settings["*"] = {
  onload: function (listview) {
    // Avoid child tables
    frappe.model.with_doctype(listview.doctype, function () {
      const meta = frappe.get_meta(listview.doctype);
      if (meta.istable) return;

      // Hook into refresh (triggers when selection changes)
      listview.page.events.on("toggle_select", () => {
        inject_esign_action(listview);
      });

      // Also inject once initially
      inject_esign_action(listview);
    });
  },
};

function inject_esign_action(listview) {
  const already_added = listview.page.actions_menu.find('[data-label="Send to eSign"]').length;
  if (already_added) return;

  listview.page.add_actions_menu_item("Send to eSign", () => {
    const selected = listview.get_checked_items();
    if (!selected.length) {
      frappe.msgprint(__('Please select at least one item.'));
      return;
    }

    show_esign_dialog(listview.doctype, selected);
  });
  console.log(`✅ 'Send to eSign' injected for ${listview.doctype}`);
}

function show_esign_dialog(doctype, selected_docs) {
  const html = selected_docs
    .map(doc => `<li>${doctype} - ${doc.name}</li>`)
    .join('');

  const dialog = new frappe.ui.Dialog({
    title: 'Send to eSign',
    fields: [
      {
        fieldtype: 'HTML',
        fieldname: 'doc_list_html'
      }
    ],
    primary_action_label: 'Send',
    primary_action() {
      console.log('📦 eSign Payload:', {
        doctype,
        docs: selected_docs
      });
      dialog.hide();
    }
  });

  dialog.fields_dict.doc_list_html.$wrapper.html(`<ul>${html}</ul>`);
  dialog.show();
}
