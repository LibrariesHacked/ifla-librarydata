$(function () {
    Papa.parse('data/ifla_data.csv', {
        header: true,
        download: true,
        complete: function (results) {
            var columns = [];
            $.each(results.meta.fields, function (i, header) {
                columns.push({ title: header });
            });
            var data = [];
            $.each(results.data, function (i, row) {
                var data_row = [];
                $.each(Object.keys(row), function (i, key) {
                    data_row.push(row[key]);
                });
                data.push(data_row);
            });
            $('#tbllibrarydata').DataTable({
                scrollX: true,
                autoWidth: false,
                data: data,
                columns: columns
            });
        }
    });
});