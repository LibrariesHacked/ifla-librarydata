$(function () {
    Papa.parse('data/ifla_data.csv', {
        header: true,
        download: true,
        complete: function (results) {
            var display_fields = ['Name', 'Public Libraries', 'School Libraries', 'Academic Libraries', 'National Libraries', 'Other Libraries', 'Community Libraries'];
            var columns = [];

            var types = ['Public', 'School', 'Academic', 'National', 'Other', 'Community'];

            $.each(types, function (x, type) {
                // Add the tab
                $('#ul-libtypes').append('<li class="' + (x === 0 ? 'is-active' : '') + '" data-tab="' + x + '"><a>' + type + '</a></li>');
                // Add the content div
                $('#div-tabcontents').append('<div class="tab-content ' + (x === 0 ? 'is-active' : '') + '" data-content="' + x + '"></div>');
            });

            $('#ul-libtypes li').on('click', function () {
                var tab = $(this).data('tab');

                $('#ul-libtypes li').removeClass('is-active');
                $(this).addClass('is-active');

                $('#div-tabcontents div').removeClass('is-active');
                $('div[data-content="' + tab + '"]').addClass('is-active');
            });

            $.each(results.meta.fields, function (i, header) { // For each field

                columnDef = { title: header, visible: false, name: header };
                if (display_fields.indexOf(header) !== -1) columnDef.visible = true;

                columns.push(columnDef);

                var lib_type = '';
                if (header.split(' ').length > 0 && types.indexOf(header.split(' ')[0]) !== -1) lib_type = types[types.indexOf(header.split(' ')[0])];
                if (lib_type !== '') {
                    var checked = display_fields.indexOf(header) !== -1 ? 'checked' : '';
                    var lib_type_index = types.indexOf(lib_type);
                    var measure = header.replace(/ /g, '');
                    $('div[data-content="' + lib_type_index + '"]').append(
                        '<input id="chb-' + measure + '" class="switcher is-checkradio is-block is-success is-small" type="checkbox" ' + checked + ' data-column="' + header + '"><label for="chb-' + measure + '">' + header.replace(lib_type + ' ', '') + '</label> '
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

            var library_table = $('#tbl-librarydata').DataTable({
                scrollX: true,
                autoWidth: false,
                data: data,
                columns: columns
            });

            $('input.switcher').change(function (e) {
                e.preventDefault();
                var name = $(this).attr('data-column') + ':name';
                var column = library_table.column(name);
                column.visible(!column.visible());
            });
        }
    });
});