//grab data from json
fetch('https://davide-mariotti.github.io/lodash/data.json')
    .then(response => response.json())
    .then(data => {
        // Store the data in localStorage
        localStorage.setItem('myData', JSON.stringify(data));
    })
    .catch(error => console.error(error));

//collect data from storage
const data = JSON.parse(localStorage.getItem('myData'));
//console.log(data)



const filters = {
  topic: [],
  author: [],
  source: [],
  year: [],
  typology: [],
  Tag: []
};

const filterData = () => _.filter(data, item => {
  return (
    (_.isEmpty(filters.topic) || _.includes(filters.topic, item.topic)) &&
    (_.isEmpty(filters.author) || _.includes(filters.author, item.author)) &&
    (_.isEmpty(filters.source) || _.includes(filters.source, item.source)) &&
    (_.isEmpty(filters.year) || _.includes(filters.year, item.year)) &&
    (_.isEmpty(filters.typology) || _.includes(filters.typology, item.typology)) &&
    (_.isEmpty(filters.tag) || _.includes(filters.tag, item.tag))
  );
});

const displayData = (data) => {
  let html = "";
  data.forEach(item => {
    html += `
          <div class="card">
            <div class="card-header" id="heading-${item.typology}">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-${item.typology}-${item.date}" aria-expanded="true" aria-controls="collapse-${item.typology}-${item.date}">
                  <span class="typology">${item.typology}</span>
                  <span class="description">${item.description}</span>
                </button>
                <span class="date">${item.date}</span>
            </div>
            <div id="collapse-${item.typology}-${item.date}" class="collapse" aria-labelledby="heading-${item.typology}-${item.date}" data-parent="#results">
              <div class="card-body">
                <div class="meta-data">
                  <div class="meta-data-item Topic">TOPIC: ${item.topic}</div>
                  <div class="meta-data-item Author">AUTHORS: ${item.author}</div>
                  <div class="meta-data-item Source">SOURCE: ${item.source}</div>
                  <div class="meta-data-item Tag">${item.tag}</div>
                </div>
                <div class="description">
                ABSTRACT:<br>
                  ${item.description}
                </div>
                <div class="containerLink">
                  <a class="Link" href="${item.link}" target="_blank">Read more</a>
                </div>
              </div>
            </div>
          </div>
        `;
  });
  document.getElementById("results").innerHTML = html;
};






// function to update filters and display filtered data
const search = () => {
  document.querySelectorAll('.filter-selected').forEach(el => el.classList.remove('filter-selected'));
  [...document.querySelectorAll("input[type='checkbox']:checked")].forEach(el => el.parentNode.classList.add('filter-selected'));

  filters.topic = [...document.querySelectorAll("#topic-filter input[type='checkbox']:checked")].map(x => x.value);
  filters.author = [...document.querySelectorAll("#author-filter input[type='checkbox']:checked")].map(x => x.value);
  filters.source = [...document.querySelectorAll("#source-filter input[type='checkbox']:checked")].map(x => x.value);
  filters.year = [...document.querySelectorAll("#year-filter input[type='checkbox']:checked")].map(x => x.value);
  filters.typology = [...document.querySelectorAll("#typology-filter input[type='checkbox']:checked")].map(x => x.value);
  filters.tag = [...document.querySelectorAll("#tag-filter input[type='checkbox']:checked")].map(x => x.value);
  const filteredData = filterData();
  displayData(filteredData);
  changeTypologyColor();
  checkFilterEmpty();
};


// create checkboxes for each filter options
const uniqueTopics = _.uniqBy(data, 'topic');
let options = '';
uniqueTopics.forEach(topic => {
  options += `<label><input type="checkbox" value="${topic.topic}" onchange="search()">${topic.topic}</label>`;
});
document.getElementById("topic-filter").innerHTML = options;

const uniqueAuthors = _.uniqBy(data, 'author');
options = '';
uniqueAuthors.forEach(author => {
  options += `<label><input type="checkbox" value="${author.author}" onchange="search()">${author.author}</label>`;
});
document.getElementById("author-filter").innerHTML = options;

const uniqueSources = _.uniqBy(data, 'source');
options = '';
uniqueSources.forEach(source => {
  options += `<label><input type="checkbox" value="${source.source}" onchange="search()">${source.source}</label>`;
});
document.getElementById("source-filter").innerHTML = options;

const uniqueYears = _.uniqBy(data, 'year');
options = '';
uniqueYears.forEach(year => {
  options += `<label><input type="checkbox" value="${year.year}" onchange="search()">${year.year}</label>`;
});
document.getElementById("year-filter").innerHTML = options;

const uniqueTypologys = _.uniqBy(data, 'typology');
options = '';
uniqueTypologys.forEach(typology => {
  options += `<label><input type="checkbox" value="${typology.typology}" onchange="search()">${typology.typology}</label>`;
});
document.getElementById("typology-filter").innerHTML = options;

const uniqueTags = _.uniqBy(data, 'tag');
options = '';
uniqueTags.forEach(tag => {
  options += `<label><input type="checkbox" value="${tag.tag}" onchange="search()">${tag.tag}</label>`;
});
document.getElementById("tag-filter").innerHTML = options;

// display all data when page loads
displayData(data);

// change BG-color to typology label results
function changeTypologyColor() {
  var elements = document.getElementsByClassName("typology");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent === "Articles") {
      elements[i].style.backgroundColor = "red";
    } if (elements[i].textContent === "Report") {
      elements[i].style.backgroundColor = "green";
    } if (elements[i].textContent === "Perspective") {
      elements[i].style.backgroundColor = "yellow";
      elements[i].style.color = "black";
    } if (elements[i].textContent === "Correspondence") {
      elements[i].style.backgroundColor = "gray";
    } if (elements[i].textContent === "News") {
      elements[i].style.backgroundColor = "blue";
    } if (elements[i].textContent === "Original Investigation") {
      elements[i].style.backgroundColor = "black";
    } if (elements[i].textContent === "New Result") {
      elements[i].style.backgroundColor = "brown";
    } if (elements[i].textContent === "Editorial") {
      elements[i].style.backgroundColor = "orange";
    } if (elements[i].textContent === "Comment") {
      elements[i].style.backgroundColor = "purple";
    } if (elements[i].textContent === "Viewpoint") {
      elements[i].style.backgroundColor = "aqua";
    } if (elements[i].textContent === "Case Report") {
      elements[i].style.backgroundColor = "burlywood";
    } else if (elements[i].textContent === "Letter") {
      elements[i].style.backgroundColor = "cadetblue";
    }
  }
};
// run the function when the page is loaded
window.addEventListener("load", changeTypologyColor);
window.addEventListener("load", checkFilterEmpty);

function checkFilterEmpty() {
  var classes = ['.card-body .Topic', '.card-body .Author', '.card-body .Source', '.card-body .Year', '.card-body .Tag', '.card-body .description'];
  for (var i = 0; i < classes.length; i++) {
    var elements = document.querySelectorAll(classes[i]);
    for (var j = 0; j < elements.length; j++) {
      if (elements[j].textContent.trim().length <= 0) {
        elements[j].remove();
      }
    }
  }

  var links = document.querySelectorAll('.card-body .Link');
  for (var k = 0; k < links.length; k++) {
    if (links[k].href.length === 42) {
      links[k].remove();
      //console.log('rimosso');
    } else {
      //console.log('ok');
    }
  }
}