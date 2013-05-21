
$("input[type=password]").each(function() {
    var $passBox = $(this);
    var $form = $passBox.parents('form');
    var action = $form.attr('action');
    $passBox.click(function() {
        alert('hi, ' + action);
    });
});
