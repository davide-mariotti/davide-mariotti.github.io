const filters = {
  topic: [],
  author: [],
  source: [],
  year: [],
  typology: [],
  tag: []
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
          <div class="meta-data-item Date">${item.date}</div>
          <div class="meta-data-item Typology">Typology: ${item.typology}</div>
          <div class="meta-data-item Topic">Topic: ${item.topic}</div>
          <div class="meta-data-item Author">Author: ${item.author}</div>
          <div class="meta-data-item Source">Source: ${item.source}</div>
          <div class="meta-data-item Year">Year: ${item.year}</div>
          <div class="meta-data-item Tag">Tag: ${item.tag}</div>
        </div>
        <div class="description">
          ${item.description}
        </div>
        <div class="link">
          <a href="${item.link}" target="_blank">Read more</a>
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