// Copyright (c) 2024, SanU and contributors
// For license information, please see license.txt


frappe.ui.form.on("Compensatory Lesson", {
	refresh(frm) {
        if (frm.doc.is_transfer === "1") {
            frappe.call({
                method: 'academia.academic_attendance.doctype.compensatory_lesson.compensatory_lesson.get_multi_groups_data',
                args: {
                    name: frm.doc.lesson_attendance
                }
            }).then(r => {
                if(r.message.length > 0) {
                    frm.set_value("is_multi_group", 1);
                    frm.set_value("multi_group", r.message);
                     
                }   
                frm.set_value("is_transfer", "2"); 
            })
           
        }
	},
    faculty(frm) {
        frm.set_query("room", function(){
			return {
				"filters": {
					"faculty": frm.doc.faculty
				}
			}
		})
    },
    before_workflow_action: async (frm) => {
        frm.refresh();
        let reject_value;
        if (frm.selected_workflow_action == "Reject") {
            let promise = new Promise((resolve, reject) => {
                frappe.prompt({
                    label: 'Reason For Rejection',
                    fieldname: 'reason_for_rejection',
                    fieldtype: 'Data',
                }, (value) => {
                    reject_value = value.reason_for_rejection;
                    if (reject_value) {
                        frappe.db.set_value('Compensatory Lesson', frm.doc.name, 'reason_for_rejection', reject_value)
                            .then(r => {
                                frm.reload_doc().then(() => {
                                    resolve();
                                    frm.refresh();
                                }).catch(err => {
                                    reject(err);
                                });
                            }).catch(err => {
                                reject(err);
                            });
                    } else {
                        reject();
                    }
                });
            });
    
            frappe.dom.unfreeze();
            await promise.catch((err) => {
                frappe.throw(`Error: ${err.message}`);
            });
        }
        
        if (frm.selected_workflow_action == "Canceled") {
            let promise = new Promise((resolve, reject) => {
                frappe.prompt({
                    label: 'Cancelled Reason',
                    fieldname: 'reason',
                    fieldtype: 'Data',
                    reqd: 1
                }, (value) => {
                    reject_value = value.reason;
                    if (reject_value) {
                        frappe.db.set_value('Compensatory Lesson', frm.doc.name, 'cancelled_reason', reject_value)
                            .then(r => {
                                frm.reload_doc().then(() => {
                                    resolve();
                                    frm.refresh();
                                }).catch(err => {
                                    reject(err);
                                });
                            }).catch(err => {
                                reject(err);
                            });
                    } else {
                        reject();
                    }
                });
            });
    
            frappe.dom.unfreeze();
            await promise.catch((err) => {
                frappe.throw(`Error: ${err.message}`);
            });
        }
    },
});