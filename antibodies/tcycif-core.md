---
title: Antibodies - Core
---

<nav>
    <ol class="breadcrumb px-0 bg-transparent">
        <li class="breadcrumb-item">
            <a href="{{ site.baseurl }}/">HOME</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ site.baseurl }}/antibodies">ANTIBODIES</a>
        </li>
        <li class="breadcrumb-item">
            CORE
        </li>
    </ol>
</nav>

#### Core Antibodies for tCyCIF (Image available, November 2018)

This is a work in progress. Our goal is to share __annotated raw images__ for each antibodies tested to achieve..... 

You can navigate through, search, and sort (by clicking the table column heading) 
the following table.

<hr class="my-5">

This work is made available under a Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) License

Antibodies have been tested for a mimum level of perfomance as descrbed in footnotes below; this should not be assumed to suggest "validation" of the antibody			

<style>
.stickyjs {
  position: fixed;
  top: 0.5em;
  left: 0;
}
.stickyjs + .table-responsive {
  padding-top: 9em;
}
</style>

{% assign abData=site.data.core-validation-set-Nov2018 %}
<div class="container-fluid px-0" id="abSearchContainer">
<div class="input-group py-5 container" >
  <div class="input-group-prepend">
    <span class="input-group-text h3 m-0" id="basic-addon1">Search Antibodies</span>
  </div>
  <input type="text" id="abSearchInput" onkeyup="abSearch()" class="form-control h3 m-0" placeholder="Type to search..." aria-label="Type to search..." aria-describedby="basic-addon1">
</div>
</div>

<div class="table-responsive">
    <table class="table table-sm table-hover table-dark" id="abTable" style="font-size: 0.8rem">
        <thead>
        {% for column in abData[0] %}
            <th onclick="sortAbTable({{ forloop.index0 }})" style="cursor:pointer" class="my-3">{{ column[0] }}</th>
        {% endfor %}
        </thead>
        <tbody>
        {% for row in abData %}
            <tr>
            {% for cell in row %}
                {% if cell[0] contains 'Link' %}
                    <td><a href="{{ cell[1] }}" target="_blank">link</a></td>
                {% elsif cell[0] contains 'Image' %}
                    <td><a href="{{ 'antibody-lists/core-validation-set-Nov2018/' | relative_url }}{{ cell[1] }}/" >View</a></td>
                {% else %}
                    <td>{{ cell[1] }}</td>
                {% endif %}
            {% endfor %}
            </tr>
        {% endfor %}
        </tbody>
    </table>
</div>

*** Show positive/correct signals in mutliple samples/tissues as judged by eye

** Show positive/correct signals in some but not all samples tested as judged by eye

\* show no signal or obviously incorrect signals in all samples tested

<script>
function abSearch() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("abSearchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("abTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    if (td.length) {
      var tdInnerAll = '';
      for (j=0; j<td.length-1; j++) {
      	tdInnerAll += ' ' + td[j].innerHTML;
      }
      if (tdInnerAll.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
var clicked =  {};
function sortAbTable(column){
    var tbl = document.getElementById("abTable").tBodies[0];
    var store = [];
    column in clicked 
        ? delete clicked[column] 
        : clicked[column] = true;
    var test = column in clicked ? 1 : -1;

    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = row.cells[column].textContent || row.cells[column].innerText;
        // if(!isNaN(sortnr)) 
        store.push([sortnr.toLowerCase(), row]);
    }
    store.sort(function(x,y){
        if (x[0] < y[0]) return -1*test;
        if (x[0] > y[0]) return 1*test;
        return 0;
    });
    console.log(store);
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}
</script>
<script>
window.onscroll = function() {myFunction()};

var header = document.getElementById("abSearchContainer");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("stickyjs");
  } else {
    header.classList.remove("stickyjs");
  }
}
</script>