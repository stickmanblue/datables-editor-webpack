import '../scss/app.scss';

import 'jquery';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'datatables.net-editor-bs';

import data from './data';

var Editor = $.fn.dataTable.Editor;
Editor.display.details = $.extend( true, {}, Editor.models.displayController, {
    "init": function ( editor ) {
        // No initialisation needed - we will be using DataTables' API to display items
        return Editor.display.details;
    },

    "open": function ( editor, append, callback ) {
        var table = $(editor.s.table).DataTable();
        var row = editor.s.modifier;

        // Close any rows which are already open
        Editor.display.details.close( editor );

        // Open the child row on the DataTable
        table
            .row( row )
            .child( append )
            .show();

        $( table.row( row ).node() ).addClass( 'shown' );

        if ( callback ) {
            callback();
        }
    },

    "close": function ( editor, callback ) {
        var table = $(editor.s.table).DataTable();

        table.rows().every( function () {
            if ( this.child.isShown() ) {
                this.child.hide();
                $( this.node() ).removeClass( 'shown' );
            }
        } );

        if ( callback ) {
            callback();
        }
    }
} );

$(document).ready(function() {
    //let editor = {};

    let editor = new $.fn.dataTable.Editor( {
        ajax: "../php/staff.php", //replace with an actual endpoint
        table: "#example",
        display: "details",
        fields: [ 
            {
                label: "First name:",
                name: "first_name"
            }, {
                label: "Last name:",
                name: "last_name"
            }, {
                label: "Position:",
                name: "position"
            }, {
                label: "Office:",
                name: "office"
            }, {
                label: "Extension:",
                name: "extn"
            }, {
                label: "Start date:",
                name: "start_date",
                type: "datetime"
            }, {
                label: "Salary:",
                name: "salary"
            }
        ]
    } );

    let table = $('#example').DataTable({
        dom: 'Bfrtip',
        data: data.data,
        columns: [
            {
                className:      'details-control',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
            { data: null, render: function ( data, type, row ) {
                // Combine the first and last names into a single table field
                return data.first_name+' '+data.last_name;
            } },
            { data: 'position' },
            { data: 'office' },
            { data: 'salary', render: $.fn.dataTable.render.number( ',', '.', 0, '$' ) }
        ],
        "order": [[1, 'asc']],
        select: true,
        buttons: [
            { extend: "create", editor: editor }
        ]
    });

    $('#example').on( 'click', 'td.details-control', function () {
        var tr = this.parentNode;

        if ( table.row( tr ).child.isShown() ) {
            editor.close();
        }
        else {
            editor.edit(
                tr,
                'Edit row',
                [
                    {
                        "className": "delete",
                        "label": "Delete row",
                        "fn": function () {
                            // Close the edit display and delete the row immediately
                            editor.close();
                            editor.remove( tr, '', null, false );
                            editor.submit();
                        }
                    }, {
                        "label": "Update row",
                        "fn": function () {
                            editor.submit();
                        }
                    }
                ]
            );
        }
    } );
});
