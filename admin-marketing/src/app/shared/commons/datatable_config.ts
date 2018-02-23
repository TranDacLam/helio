export const datatable_config = {
    dtOptions : {
        pagingType: "full_numbers",
        columnDefs: [{
            orderable: false,
            className: "dt-center",
            targets: 0
        }], 
        order: [[ 1, 'desc' ]],
        language: {
            sSearch: "",
            searchPlaceholder: "Nhập thông tin tìm kiếm",
            lengthMenu: "Hiển thị _MENU_ dòng",
            sZeroRecords:  "Không tìm thấy dòng nào phù hợp",
            info: "Hiển thị _START_ đến _END_ của _TOTAL_",
            paginate: {
                'first': "Đầu",
                'last': "Cuối",
                'next': "Sau",
                'previous': "Trước"
            }
        }
    }
}