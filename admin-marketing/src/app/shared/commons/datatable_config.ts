declare var window:any;

/* 
    Function: Customize dataTable
    @author: Trangle
*/ 
export let data_config = function(record) {
    return {
        record: record,
        order: [ 1, 'desc'],
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
        search: {
            smart: false
        }
    };
}

export let datatable_custom_order = function ( locales ) {
    if ( window.Intl ) {
        var collator = new window.Intl.Collator( locales );
        let types:any = $.fn.dataTable.ext.type;
        delete types.order['string-pre'];
        delete types.order['html-pre'];
        types.order['string-asc'] = function ( a, b ) {  
            a = a ? a.replace( /<.*?>/g, "" ).toLowerCase() : '';
            b = b ? b.replace( /<.*?>/g, "" ).toLowerCase() : '';
            return collator.compare( a, b ) * 1;
        };
        types.order['string-desc'] = function ( a, b ) {
            a = a ? a.replace( /<.*?>/g, "" ).toLowerCase() : '';
            b = b ? b.replace( /<.*?>/g, "" ).toLowerCase() : '';
            return collator.compare( a, b ) * -1;
        };
    }
};