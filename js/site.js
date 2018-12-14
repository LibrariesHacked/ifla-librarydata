$(function () {
    Papa.parse('data/ifla_data.csv', {
        header: true,
        download: true,
        complete: function (results) {
            var display_fields = ['Name'];
            var columns = [];
            $.each(results.meta.fields, function (i, header) {
                columns.push({ title: header });
                var types = ['School', 'Public', 'Community', 'Other', 'National', 'Academic'];
                if (header.split(' ').length > 0 && types.indexOf(header.split(' ')[0]) !== -1) {
                    type = types[types.indexOf(header.split(' ')[0])];
                    $('#dd' + type.toLowerCase() + 'fields').append(
                        '<div class="field"><input class="is-checkradio is-block is-success" id="exampleCheckboxBlockSuccess" type="checkbox" name="exampleCheckboxBlockSuccess" checked="checked"><label for="exampleCheckboxBlockSuccess">' + header.replace(type + ' ', '') + '</label></div>'
                    );
                }
            });
            var data = [];
            $.each(results.data, function (i, row) {
                var data_row = [];
                $.each(Object.keys(row), function (i, key) {
                    data_row.push(row[key]);
                });
                data.push(data_row);
            });

            var library_table = $('#tbllibrarydata').DataTable({
                scrollX: true,
                autoWidth: false,
                data: data,
                columns: columns
            });

            $('a.toggle-vis').on('click', function (e) {
                e.preventDefault();

                // Get the column API object
                var column = library_table.column($(this).attr('data-column'));

                // Toggle the visibility
                column.visible(!column.visible());
            });
        }
    });
});