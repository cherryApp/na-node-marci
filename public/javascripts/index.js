/**
 * A gomb megnyomására kilistázza a fizetéseket.
 */
var professionSelect = $('select[name=profession]');
var salaryList = $('ul.list-group.salary-list');
var itemTemplate = $('li.list-group-item.template');

$('.find-profession-btn').on('click', function() {
    var prof = professionSelect.val();
    $.getJSON('/ajax/salaries-for-profession/'+prof, function(res) {
        console.log(res);
        salaryList.html('');
        $.each(res, function(index, item) {
            itemTemplate.clone().html(
                '<strong>' + item.amount + '</strong>'
            )
            .appendTo(salaryList);
        });
        salaryList.slideDown();
    });
});