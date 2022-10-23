let ID = 0;

let process = [];

function init() {
    $("#timer_title_selection_2").attr('style', 'display: none;');
    $("#timer_title_selection").attr('style', '');
    $("#btn_add").click(addLine);
    $("#btn_del").click(delLine);
}

function addLine() {
    const selector = $('#selector').val();
    const selector_text = $('#selector').find("option:selected").text();
    const select_type = $('#select_type').val();
    const select_type_text = $('#select_type').find("option:selected").text();
    if (select_type === 'freeInit') {
        let timer_title = [];
        timer_title.push($('#timer_title_l').val());
        timer_title.push($('#timer_title_r').val());
    }
    const timer_title = $('#timer_title').val();
    const main_title = $('#main_title').val();
    ID+=1;
    const table_html = `<tr id='${ID}'>
    <td>${ID}</td>
    <td>${selector_text}</td>
    <td>${select_type_text}</td>
    <td>${timer_title}</td>
    <td>${main_title}</td>
    </tr>`;
    $('#table').append(table_html);
    process.push({
        selector: selector,
        type: select_type,
        title: timer_title,
        mainTitle: main_title
    });
}

function delLine() {
    if (process.length <= 0) {
        return;
    }
    const item = process[process.length-1];
    // set item to DOM
    $(".selector").val(item.selector);
    $(".select_type").val(item.type);
    $(".timer_title").val(item.title);
    $(".main_title").val(item.mainTitle);
    $(`#${ID}`).remove();
    ID-=1;
}

window.onload = init;