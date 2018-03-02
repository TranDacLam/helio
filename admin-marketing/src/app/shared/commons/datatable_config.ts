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
        },
        scrollX: true
    }
}
/* 
    Function: Customize dataTable
    @author: Trangle
*/ 
export let data_config = function(record) {
    return {
        record: record,
        dtOptions : {
            // Declare the use of the extension in the dom parameter
            language: {
                sSearch: '',
                searchPlaceholder: ' Nhập thông tin tìm kiếm',
                lengthMenu: `Hiển thị _MENU_ ${record}`,
                info: `Hiển thị _START_ tới _END_ của _TOTAL_ ${record}`,
                paginate: {
                    "first":      "Đầu",
                    "last":       "Cuối",
                    "next":       "Sau",
                    "previous":   "Trước"
                },
                select: {
                    rows: ''
                },
                sInfoFiltered: "",
                zeroRecords: `Không có ${record} nào để hiển thị`,
                infoEmpty: ""
            },
            responsive: true,
            pagingType: "full_numbers",
        }
    };
}