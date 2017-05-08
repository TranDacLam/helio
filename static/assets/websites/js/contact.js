
$(document).ready(function() {
console.log("aaaaa")
		$("#form_contact").validate({
			rules: {
				name: "required",

				email: {
					required: true,
					email: true
				},
				phone: {
					required: true,
					maxlength: 11,
					number: true
				},
				subject: "required"
			},

			messages: {
				name: "Vui lòng nhập tên",
				email: {
					required: "Vui lòng nhập Email",
					email: "Vui lòng nhập đúng định dạng Email"
				},
				phone: {
					required: "Vui lòng nhập số điện thoại",
					minlength: "Số máy quý khách vừa nhập là số không có thực",
					maxlength: "Số máy quý khách vừa nhập là số không có thực",
					number: "Vui lòng nhập đúng định dạng số điện thoại"
				},
				subject: "Vui lòng nhập chủ đề"
			}
		});
	});