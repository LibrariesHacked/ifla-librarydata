$(function () {
    Papa.parse('data/ifla_data.csv', {
        header: true,
        download: true,
        complete: function (results) {
            var display_fields = ['Name', 'Academic Number of Libraries'];
            var columns = [];
            $.each(results.meta.fields, function (i, header) {
                columnDef = { title: header, visible: false, name: header };
                if (display_fields.indexOf(header) !== -1) columnDef.visible = true;

                if (header === 'Name') {
                    columnDef.render = function (data, type, row, meta) {
                        return data + '&nbsp;<span class="icon"><i class="fas fa-info-circle"></i></span>';
                    }
                }

                columns.push(columnDef);
                var types = ['School', 'Public', 'Community', 'Other', 'National', 'Academic'];
                if (header.split(' ').length > 0 && types.indexOf(header.split(' ')[0]) !== -1) {
                    type = types[types.indexOf(header.split(' ')[0])];
                    var checked = display_fields.indexOf(header) !== -1 ? 'checked' : '';
                    $('#switchers' + type.toLowerCase()).append(
                        '<input id="chb' + header.replace(/ /g, '') + '" class="switcher is-checkradio is-block is-success is-small" type="checkbox" ' + checked + '" data-column="' + header + '"><label for="chb' + header.replace(/ /g, '') + '">' + header.replace(type + ' ', '') + '</label>'
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

            $('input.switcher').change(function (e) {
                e.preventDefault();
                var name = $(this).attr('data-column') + ':name';
                var column = library_table.column(name);
                column.visible(!column.visible());
            });

            $('#tabs li').on('click', function () {
                var tab = $(this).data('tab');

                $('#tabs li').removeClass('is-active');
                $(this).addClass('is-active');

                $('#tab-content p').removeClass('is-active');
                $('p[data-content="' + tab + '"]').addClass('is-active');
            });
        }
    });
});