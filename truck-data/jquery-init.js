let data = {};

$.get("database.csv", function(response, status) {
  if(status=="success") {
    data = $.csv.toObjects(response);
    let html = '';
    const body = document.querySelector("body");
    for(let row in data) {
      html += '<tr>\r\n';
      for(let item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      $('#contents').html(html);
    }
  }
})
